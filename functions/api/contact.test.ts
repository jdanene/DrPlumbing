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
      time: "Afternoon",
      message: "No heat <script>",
      companyWebsite: "",
      startedAt: Date.now() - 3_000,
      ...overrides,
    }),
  });
}

describe("contact endpoint", () => {
  it("sends a plain-text message to the server-owned addresses", async () => {
    const send = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const response = await handleContactRequest(
      request(),
      { CF_ACCOUNT_ID: "account", CF_EMAIL_API_TOKEN: "secret" },
      send,
    );

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    const [url, init] = send.mock.calls[0];
    expect(url).toContain("/accounts/account/email/sending/send");
    expect(init.headers.Authorization).toBe("Bearer secret");
    const body = JSON.parse(init.body);
    expect(body.to[0].email).toBe("drplumbinggroup@gmail.com");
    expect(body.from.email).toBe("website@drplumbingheating.com");
    expect(body.text).toContain("Details: No heat <script>");
    expect(body.html).toBeUndefined();
  });

  it("rejects invalid customer data before calling the provider", async () => {
    const send = vi.fn();
    const response = await handleContactRequest(
      request({ name: "", phone: "letters" }),
      { CF_ACCOUNT_ID: "account", CF_EMAIL_API_TOKEN: "secret" },
      send,
    );
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("absorbs honeypot submissions without sending customer data", async () => {
    const send = vi.fn();
    const response = await handleContactRequest(
      request({ companyWebsite: "https://spam.example" }),
      {},
      send,
    );
    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports missing configuration and upstream failure", async () => {
    expect((await handleContactRequest(request(), {})).status).toBe(503);
    const send = vi.fn().mockResolvedValue(new Response("failure", { status: 500 }));
    expect(
      (
        await handleContactRequest(
          request(),
          { CF_ACCOUNT_ID: "account", CF_EMAIL_API_TOKEN: "secret" },
          send,
        )
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
