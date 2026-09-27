import { describe, expect, it, vi } from "vitest";
import { handleEmailRequest } from "./index";

/**
 * Description: Builds one private service request for the email Worker.
 * Inputs: body replaces the default valid delivery payload.
 * Output: A JSON POST Request targeting the Worker's /send route.
 * Examples: deliveryRequest({ subject: "" }) exercises empty-subject validation.
 */
function deliveryRequest(body: Record<string, unknown> = {}): Request {
  return new Request("https://contact-email.internal/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Callback request: Boilers",
      text: "Name: Taylor\nPhone: 206-555-0123",
      ...body,
    }),
  });
}

describe("contact email Worker", () => {
  it("uses the fixed recipient and sender", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "message-id" });
    const response = await handleEmailRequest(deliveryRequest(), {
      CONTACT_INBOX: { send },
    });

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledWith({
      to: "drplumbinggroup@gmail.com",
      from: "website@drplumbingheating.com",
      subject: "Callback request: Boilers",
      text: "Name: Taylor\nPhone: 206-555-0123",
    });
  });

  it("rejects malformed payloads before email delivery", async () => {
    const send = vi.fn();
    const response = await handleEmailRequest(
      deliveryRequest({ subject: "" }),
      { CONTACT_INBOX: { send } },
    );
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("masks binding errors", async () => {
    const send = vi.fn().mockRejectedValue(new Error("provider detail"));
    const response = await handleEmailRequest(deliveryRequest(), {
      CONTACT_INBOX: { send },
    });
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Email delivery failed.",
    });
  });
});
