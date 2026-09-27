import { validateBooking } from "../../src/booking";

const RECIPIENT = "drplumbinggroup@gmail.com";
const SENDER = "website@drplumbingheating.com";
const MAX_BODY_BYTES = 8_192;

interface ContactEnv {
  CF_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
}

interface ContactPayload {
  name: string;
  phone: string;
  city: string;
  service: string;
  time: string;
  message: string;
  companyWebsite: string;
  startedAt: number;
}

interface PagesContext {
  request: Request;
  env: ContactEnv;
}

/**
 * Description: Accepts only POST requests for the public contact endpoint.
 * Inputs: context contains the request and encrypted Pages environment bindings.
 * Output: A 405 JSON response for other methods, or the contact-handler response.
 * Examples: GET /api/contact returns 405; POST delegates to onRequestPost.
 */
export function onRequest(context: PagesContext): Promise<Response> | Response {
  if (context.request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405, {
      Allow: "POST",
    });
  }
  return onRequestPost(context);
}

/**
 * Description: Sends one validated callback request through Cloudflare Email Service.
 * Inputs: request must be same-origin JSON; env holds the account ID and API token.
 * Output: JSON success, a caller-fixable 4xx response, or a retryable 5xx response.
 * Examples: A valid request returns 200; a filled honeypot returns 200 without email.
 */
export function onRequestPost(context: PagesContext): Promise<Response> {
  return handleContactRequest(context.request, context.env);
}

/**
 * Description: Implements the contact boundary while allowing tests to replace the email transport.
 * Inputs: request and env are untrusted; send must implement the fetch interface.
 * Output: A JSON Response. It never logs or returns customer details.
 * Examples: Tests pass a fake send function and assert the server-owned recipient.
 */
export async function handleContactRequest(
  request: Request,
  env: ContactEnv,
  send: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin) {
    return json({ ok: false, error: "Invalid request origin." }, 403);
  }
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "Send JSON." }, 415);
  }
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  const payload = await parsePayload(request);
  if (!payload) return json({ ok: false, error: "Invalid request." }, 400);
  if (payload.companyWebsite) return json({ ok: true });

  const elapsed = Date.now() - payload.startedAt;
  if (elapsed < 1_500 || elapsed > 7_200_000) {
    return json({ ok: false, error: "Refresh the page and try again." }, 400);
  }
  const errors = validateBooking(payload.name, payload.phone);
  if (errors.name || errors.phone) {
    return json({ ok: false, error: "Check your name and phone number." }, 400);
  }
  if (!env.CF_ACCOUNT_ID || !env.CF_EMAIL_API_TOKEN) {
    return json({ ok: false, error: "Email delivery is not configured." }, 503);
  }

  const response = await send(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_ACCOUNT_ID)}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [{ email: RECIPIENT, name: "Dr Plumbing & Heating" }],
        from: { email: SENDER, name: "Dr Plumbing website" },
        subject: `Callback request: ${singleLine(payload.service) || "Not sure"}`,
        text: contactMessage(payload),
      }),
    },
  );
  if (!response.ok) {
    return json({ ok: false, error: "Email delivery failed. Try again." }, 502);
  }
  return json({ ok: true });
}

/**
 * Description: Parses a bounded JSON object into the endpoint's stable payload shape.
 * Inputs: request body fields may have any JSON type and are capped independently.
 * Output: A trimmed payload, or null for malformed JSON and invalid field types.
 * Examples: Missing optional text becomes ""; an object-valued name returns null.
 */
async function parsePayload(request: Request): Promise<ContactPayload | null> {
  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return null;
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const text = (key: string, max: number): string | null => {
    const value = record[key] ?? "";
    return typeof value === "string" && value.length <= max
      ? value.trim()
      : null;
  };
  const name = text("name", 80);
  const phone = text("phone", 32);
  const city = text("city", 80);
  const service = text("service", 80);
  const time = text("time", 40);
  const message = text("message", 2_000);
  const companyWebsite = text("companyWebsite", 200);
  if (
    name === null ||
    phone === null ||
    city === null ||
    service === null ||
    time === null ||
    message === null ||
    companyWebsite === null ||
    typeof record.startedAt !== "number" ||
    !Number.isFinite(record.startedAt)
  ) {
    return null;
  }
  return {
    name,
    phone,
    city,
    service,
    time,
    message,
    companyWebsite,
    startedAt: record.startedAt,
  };
}

/**
 * Description: Formats the validated request as plain text for the business inbox.
 * Inputs: payload contains trimmed, length-bounded visitor fields.
 * Output: Plain text with one labeled field per line; blank optional details are marked.
 * Examples: A blank message ends with "Details: Not provided".
 */
function contactMessage(payload: ContactPayload): string {
  return [
    "New website callback request",
    "",
    `Name: ${singleLine(payload.name)}`,
    `Phone: ${singleLine(payload.phone)}`,
    `City: ${singleLine(payload.city) || "Not provided"}`,
    `Service: ${singleLine(payload.service) || "Not sure"}`,
    `Best time: ${singleLine(payload.time) || "Not provided"}`,
    "",
    `Details: ${payload.message || "Not provided"}`,
  ].join("\n");
}

/**
 * Description: Keeps user text from creating extra email-header-like lines.
 * Inputs: value is bounded text that may contain line breaks.
 * Output: One whitespace-normalized line.
 * Examples: "Heating\nBcc" becomes "Heating Bcc".
 */
function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Description: Builds consistent JSON responses for every endpoint exit.
 * Inputs: body is JSON-safe; status is an HTTP status; headers are optional additions.
 * Output: A no-store JSON Response.
 * Examples: json({ ok: true }) returns a 200 application/json response.
 */
function json(
  body: Record<string, unknown>,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
