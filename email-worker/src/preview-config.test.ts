import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import previewWorker from "./preview";

const production = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const preview = JSON.parse(readFileSync(new URL("../wrangler.preview.jsonc", import.meta.url), "utf8"));
const pages = JSON.parse(readFileSync(new URL("../../wrangler.jsonc", import.meta.url), "utf8"));

describe("temporary dev contact email", () => {
  it("keeps production restricted to the owner's inbox", () => {
    expect(production.send_email[0].destination_address).toBe("drplumbinggroup@gmail.com");
    expect(pages.services[0].service).toBe(production.name);
  });

  it("routes preview forms through a private worker restricted to Jide's inbox", () => {
    expect(preview.send_email[0].destination_address).toBe("dominicanene@gmail.com");
    expect(preview.send_email[0].allowed_sender_addresses).toEqual(["website@drplumbingheating.com"]);
    expect(preview.name).not.toBe(production.name);
    expect(preview.workers_dev).toBe(false);
    expect(preview.preview_urls).toBe(false);
    expect(pages.env.preview.services).toEqual([
      { binding: "CONTACT_EMAIL", service: preview.name },
    ]);
  });

  it("sends only to Jide even when the caller supplies another recipient", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "preview-message" });
    const request = new Request("https://contact-email.internal/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Callback request: Test",
        text: "Dev contact-form test",
        to: "drplumbinggroup@gmail.com",
      }),
    });

    const response = await previewWorker.fetch(request, { CONTACT_INBOX: { send } });

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledWith({
      to: "dominicanene@gmail.com",
      from: "website@drplumbingheating.com",
      subject: "Callback request: Test",
      text: "Dev contact-form test",
    });
  });
});
