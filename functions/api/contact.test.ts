import { describe, expect, it, vi } from "vitest";
import { handleContactRequest, onRequest } from "./contact";

const origin = "https://drplumbing.pages.dev";

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
  });
});
