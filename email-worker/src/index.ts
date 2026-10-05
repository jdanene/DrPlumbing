const RECIPIENT = "dominicanene@gmail.com";
const SENDER = "website@drplumbingheating.com";
const MAX_BODY_BYTES = 4_096;

interface EmailBinding {
  send(message: {
    to: string;
    from: string;
    subject: string;
    text: string;
  }): Promise<{ messageId: string }>;
}

interface EmailWorkerEnv {
  CONTACT_INBOX: EmailBinding;
}

interface DeliveryPayload {
  subject: string;
  text: string;
}

/**
 * Description: Delivers validated website messages through Cloudflare's native email binding.
 * Inputs: Only POST /send with bounded JSON is accepted; env owns the fixed recipient and sender binding.
 * Output: A small JSON response. Delivery errors return 502 without exposing provider details.
 * Examples: POST /send with subject and text returns 200 after CONTACT_INBOX.send resolves.
 */
export async function handleEmailRequest(
  request: Request,
  env: EmailWorkerEnv,
): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== "POST" || url.pathname !== "/send") {
    return json({ ok: false, error: "Not found." }, 404);
  }
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "Send JSON." }, 415);
  }
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  const payload = await parseDelivery(request);
  if (!payload) return json({ ok: false, error: "Invalid request." }, 400);

  try {
    await env.CONTACT_INBOX.send({
      to: RECIPIENT,
      from: SENDER,
      subject: payload.subject,
      text: payload.text,
    });
  } catch {
    return json({ ok: false, error: "Email delivery failed." }, 502);
  }
  return json({ ok: true });
}

/**
 * Description: Parses the private service request into the email Worker's narrow contract.
 * Inputs: request contains JSON with one subject and one plain-text body.
 * Output: Trimmed fields, or null for malformed, empty, or oversized values.
 * Examples: { subject: "Callback", text: "Name: Taylor" } returns both fields.
 */
async function parseDelivery(request: Request): Promise<DeliveryPayload | null> {
  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) return null;
    raw = JSON.parse(body);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (
    typeof record.subject !== "string" ||
    typeof record.text !== "string" ||
    record.subject.length > 120 ||
    record.text.length > 3_500
  ) {
    return null;
  }
  const subject = record.subject.replace(/\s+/g, " ").trim();
  const text = record.text.trim();
  return subject && text ? { subject, text } : null;
}

/**
 * Description: Builds consistent no-store JSON responses for the private Worker.
 * Inputs: body is JSON-safe and status is an HTTP status.
 * Output: An application/json Response that caches nowhere.
 * Examples: json({ ok: true }) returns status 200.
 */
function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export default {
  fetch(request: Request, env: EmailWorkerEnv): Promise<Response> {
    return handleEmailRequest(request, env);
  },
};
