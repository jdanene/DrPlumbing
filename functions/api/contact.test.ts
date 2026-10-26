import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContactRequest, onRequest } from "./contact";

const origin = "https://drplumbing.pages.dev";
const leadEnv = {
  MAPPACK_LEADS_URL: "https://leads.example.com/api/leads",
  MAPPACK_LEAD_KEY: "test-lead-key",
};
const storedLead = { lead_id: "12345678-1234-4234-8234-123456789abc", owner_text: "sent" };

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/**
 * Description: Builds a same-origin JSON request with a human-speed timestamp.
 * Inputs: overrides replace individual valid form fields.
 * Output: A POST Request accepted by the contact boundary.
 * Examples: request({ companyWebsite: "spam" }) exercises the honeypot path.
 */
function request(overrides: Record<string, unknown> = {}): Request {
  return new Request(`${origin}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({
      name: "Taylor",
      phone: "(206) 555-0123",
      city: "Newcastle",
      service: "Boilers",
      urgency: "Today",
      time: "Afternoon",
      message: "No heat <script>",
      companyWebsite: "",
      startedAt: Date.now() - 3_000,
      ...overrides,
    }),
  });
}

describe("contact endpoint", () => {
  it("reports both delivered and maps a repeatable lead request", async () => {
    vi.spyOn(Date, "now").mockReturnValue(120_000);
    const email = vi.fn().mockImplementation(() => Response.json({}));
    const lead = vi.fn().mockImplementation(() => Response.json(storedLead, { status: 201 }));
    vi.stubGlobal("fetch", lead);
    const first = request({ startedAt: 116_000 });
    first.headers.set("Referer", `${origin}/book/?${"x".repeat(600)}`);
    const response = await handleContactRequest(first.clone(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    expect(await response.json()).toEqual({ ok: true, email: "sent", lead: "sent" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Content-Type")).toContain("application/json");
    const [url, init] = lead.mock.calls[0];
    expect(url).toBe(leadEnv.MAPPACK_LEADS_URL);
    expect(init.redirect).toBe("manual");
    expect(init.headers).toMatchObject({ Authorization: "Bearer test-lead-key", "Content-Type": "application/json" });
    expect(init.headers["Idempotency-Key"]).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.parse(init.body)).toEqual({
      source: "drplumbing.pages.dev", name: "Taylor", phone: "(206) 555-0123",
      city: "Newcastle", service: "Boilers", urgency: "Today", preferred_time: "Afternoon",
      details: "No heat <script>", page_url: first.headers.get("Referer")!.slice(0, 500),
    });
    vi.mocked(Date.now).mockReturnValue(180_000);
    lead.mockImplementation(() => Response.json({ ...storedLead, owner_text: "failed" }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleContactRequest(first.clone(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv })).status).toBe(200);
    expect(lead.mock.calls[1][1].headers["Idempotency-Key"]).toBe(init.headers["Idempotency-Key"]);
    expect(console.error).toHaveBeenCalledWith("booking owner_text failed: upstream MapPack reported failed");
    const later = request({ startedAt: 176_000 });
    later.headers.set("Referer", first.headers.get("Referer")!);
    await handleContactRequest(later, { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    expect(lead.mock.calls[2][1].headers["Idempotency-Key"]).not.toBe(init.headers["Idempotency-Key"]);
    const changed = request({ startedAt: 116_000, message: "Different request" });
    changed.headers.set("Referer", first.headers.get("Referer")!);
    await handleContactRequest(changed, { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    expect(lead.mock.calls[3][1].headers["Idempotency-Key"]).not.toBe(init.headers["Idempotency-Key"]);
    const host = `${"a".repeat(60)}.${"b".repeat(60)}.example`;
    const longHost = new Request(`https://${host}/api/contact`, request({ city: undefined, time: undefined, message: "", service: "Heating\nBcc" }));
    longHost.headers.set("Origin", `https://${host}`);
    await handleContactRequest(longHost, { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    expect(JSON.parse(lead.mock.calls[4][1].body)).toMatchObject({ source: host.slice(0, 80), city: "", preferred_time: "", page_url: "" });
    expect(JSON.parse(email.mock.calls[4][1].body)).toMatchObject({ subject: "TODAY: Callback request: Heating Bcc", text: expect.stringContaining("Details: Not provided") });
    expect(email).toHaveBeenCalledTimes(5);
  });

  it("returns 200 when email fails and the lead is delivered", async () => {
    vi.useFakeTimers();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const email = vi.fn().mockImplementation(() => new Promise<Response>(() => {}));
    const lead = vi.fn().mockImplementation(() => Response.json({ ...storedLead, owner_text: "skipped" }, { status: 201 }));
    vi.stubGlobal("fetch", lead);
    const pending = handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    await vi.waitFor(() => expect(lead).toHaveBeenCalledOnce());
    expect(email).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(8_000);
    const response = await pending;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, email: "failed", lead: "sent" });
    expect(email.mock.calls[0][1].signal.aborted).toBe(true);
    expect(log).toHaveBeenCalledWith("booking email failed: timeout delivery exceeded 8 seconds");
    email.mockRejectedValue(new Error("Taylor test-lead-key"));
    expect((await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv })).status).toBe(200);
    expect((await handleContactRequest(request(), leadEnv)).status).toBe(200);
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/Taylor|test-lead-key/);
  });

  it("returns 502 when both delivery channels fail", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const email = vi.fn().mockImplementation(() => new Response("private upstream detail", { status: 500 }));
    const lead = vi.fn();
    vi.stubGlobal("fetch", lead);
    for (const status of [401, 429, 503, 302, 204, 201]) {
      lead.mockImplementation(() => status === 204 ? new Response(null, { status }) : Response.json({ lead_id: "bad", owner_text: "sent", error: "Taylor test-lead-key" }, { status }));
      const response = await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
      expect(response.status).toBe(502);
      expect(await response.json()).toMatchObject({ ok: false, email: "failed", lead: "failed" });
    }
    expect(lead).toHaveBeenCalledTimes(6);
    expect(log).toHaveBeenCalledWith("booking lead failed: http unknown or revoked lead key (401)");
    expect(log).toHaveBeenCalledWith("booking lead failed: http rate limited (429)");
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/Taylor|test-lead-key|private upstream detail/);
    for (const body of [null, [], { ...storedLead, owner_text: "unknown" }, { ...storedLead, owner_text: {} }]) {
      lead.mockImplementation(() => Response.json(body, { status: 201 }));
      expect((await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv })).status).toBe(502);
    }
    lead.mockImplementation(() => new Response("<html>not the endpoint</html>", { status: 200 }));
    expect((await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv })).status).toBe(502);
    lead.mockRejectedValue(new Error("Taylor test-lead-key"));
    expect((await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv })).status).toBe(502);
    vi.useFakeTimers();
    for (const stallsAtBody of [false, true]) {
      lead.mockImplementation(() => stallsAtBody
        ? { status: 201, json: () => new Promise(() => {}) }
        : new Promise<Response>(() => {}));
      const expectedCalls = lead.mock.calls.length + 1;
      const pending = handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
      await vi.waitFor(() => expect(lead).toHaveBeenCalledTimes(expectedCalls));
      await vi.advanceTimersByTimeAsync(8_000);
      expect((await pending).status).toBe(502);
      expect(lead.mock.calls.at(-1)![1].signal.aborted).toBe(true);
    }
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/Taylor|test-lead-key|private upstream detail/);
  });

  it("uses email only when both lead secrets are missing", async () => {
    const email = vi.fn().mockImplementation(() => Response.json({}));
    const lead = vi.fn();
    vi.stubGlobal("fetch", lead);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await (await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email } })).json()).toEqual({ ok: true, email: "sent", lead: "skipped" });
    for (const config of [
      { MAPPACK_LEADS_URL: leadEnv.MAPPACK_LEADS_URL },
      { MAPPACK_LEAD_KEY: leadEnv.MAPPACK_LEAD_KEY },
      { ...leadEnv, MAPPACK_LEADS_URL: "http://leads.example.com/api/leads" },
      { ...leadEnv, MAPPACK_LEADS_URL: "https://user:pass@leads.example.com/api/leads" },
      { ...leadEnv, MAPPACK_LEADS_URL: "https://leads.example.com/api/leads?key=private" },
      { ...leadEnv, MAPPACK_LEADS_URL: "not a URL" },
      { ...leadEnv, MAPPACK_LEAD_KEY: "bad\nkey" },
      { ...leadEnv, MAPPACK_LEAD_KEY: "" },
    ]) {
      expect(await (await handleContactRequest(request(), { CONTACT_EMAIL: { fetch: email }, ...config })).json()).toEqual({ ok: true, email: "sent", lead: "failed" });
    }
    for (const fields of [{ companyWebsite: "spam" }, { startedAt: Date.now() - 7_200_001 }]) {
      await handleContactRequest(request(fields), { CONTACT_EMAIL: { fetch: email }, ...leadEnv });
    }
    expect(email).toHaveBeenCalledTimes(9);
    expect(lead).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(8);
  });

  it("sends plain text through the private service binding", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const response = await handleContactRequest(request(), {
      CONTACT_EMAIL: { fetch },
    });

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://contact-email.internal/send");
    const body = JSON.parse(init.body);
    expect(body.text).toContain("Details: No heat <script>");
    expect(body.text).toContain("How soon: Today");
    expect(body.subject).toBe("TODAY: Callback request: Boilers");
  });

  it("rejects invalid customer data before calling the provider", async () => {
    const fetch = vi.fn();
    const response = await handleContactRequest(
      request({ name: "", phone: "letters" }),
      { CONTACT_EMAIL: { fetch } },
    );
    expect(response.status).toBe(400);
    expect((await handleContactRequest(request({ name: {} }), { CONTACT_EMAIL: { fetch } })).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects invented urgency values", async () => {
    const fetch = vi.fn();
    const response = await handleContactRequest(
      request({ urgency: "TODAY\nBcc: someone@example.com" }),
      { CONTACT_EMAIL: { fetch } },
    );
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("absorbs honeypot submissions without sending customer data", async () => {
    const fetch = vi.fn();
    const response = await handleContactRequest(
      request({ companyWebsite: "https://spam.example" }),
      { CONTACT_EMAIL: { fetch } },
    );
    expect(response.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports missing configuration and upstream failure", async () => {
    expect((await handleContactRequest(request(), {})).status).toBe(503);
    const fetch = vi.fn().mockResolvedValue(new Response("failure", { status: 500 }));
    expect(
      (
        await handleContactRequest(request(), { CONTACT_EMAIL: { fetch } })
      ).status,
    ).toBe(502);
  });

  it("rejects cross-origin and non-POST requests", async () => {
    const crossOrigin = request();
    crossOrigin.headers.set("Origin", "https://example.com");
    expect((await handleContactRequest(crossOrigin, {})).status).toBe(403);
    expect(
      onRequest({ request: new Request(`${origin}/api/contact`), env: {} }).status,
    ).toBe(405);
    expect((await onRequest({ request: request(), env: {} })).status).toBe(503);
  });
});
