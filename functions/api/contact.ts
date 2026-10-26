/**
 * Description: Validates public bookings and delivers them through independent server channels.
 * Inputs: Same-origin form JSON, a private email binding, and optional MapPack secrets.
 * Output: Private JSON outcomes; either delivered channel makes the request successful.
 * Examples: Both deliveries return 200; an email timeout with a stored lead also returns 200.
 */
import { URGENCY_OPTIONS, validateBooking } from "../../src/booking";

const MAX_BODY_BYTES = 8_192;
const DELIVERY_TIMEOUT_MS = 8_000;
type DeliveryOutcome = "sent" | "skipped" | "failed";
type DeliveryChannel = "email" | "lead";
interface DeliveryFailure { type: string; reason: string }

interface ContactEnv {
  CONTACT_EMAIL?: {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  };
  MAPPACK_LEADS_URL?: string;
  MAPPACK_LEAD_KEY?: string;
}

interface ContactPayload {
  name: string;
  phone: string;
  city: string;
  service: string;
  urgency: string;
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
 * Description: Delivers a validated callback request through the configured server channels.
 * Inputs: request must be same-origin JSON; env holds private delivery configuration.
 * Output: JSON success, a caller-fixable 4xx response, or a delivery 5xx response.
 * Examples: A filled honeypot returns 200 without either delivery.
 */
export function onRequestPost(context: PagesContext): Promise<Response> {
  return handleContactRequest(context.request, context.env);
}

/**
 * Description: Validates bookings before starting email and lead delivery concurrently.
 * Inputs: request is untrusted; absent channels are skipped, invalid configuration fails.
 * Output: JSON with both outcomes after delivery; 200 if either sent, 503 if both skipped, else 502.
 * Examples: Email failure with a stored lead returns { ok: true, email: "failed", lead: "sent" }.
 */
export async function handleContactRequest(
  request: Request,
  env: ContactEnv,
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
  const [email, lead] = await Promise.all([
    sendEmail(payload, env),
    storeLead(request, payload, env),
  ]);
  if (email === "sent" || lead === "sent") return json({ ok: true, email, lead });
  const unconfigured = email === "skipped" && lead === "skipped";
  return json({
    ok: false, email, lead,
    error: unconfigured ? "Delivery is not configured." : "Delivery failed. Try again.",
  }, unconfigured ? 503 : 502);
}

/**
 * Description: Sends the existing inbox message independently of MapPack availability.
 * Inputs: payload is validated; env may omit the private email binding.
 * Output: A bounded delivery outcome; upstream bodies and errors stay out of logs.
 * Examples: A missing binding returns "skipped"; a stuck binding returns "failed" after 8 seconds.
 */
async function sendEmail(payload: ContactPayload, env: ContactEnv): Promise<DeliveryOutcome> {
  if (!env.CONTACT_EMAIL) return "skipped";
  const binding = env.CONTACT_EMAIL;
  return deliver("email", async (signal) => {
    const response = await binding.fetch("https://contact-email.internal/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "manual", signal,
      body: JSON.stringify({
        subject: `${payload.urgency === "Today" ? "TODAY: " : ""}Callback request: ${singleLine(payload.service) || "Not sure"}`,
        text: contactMessage(payload),
      }),
    });
    return response.ok ? null : { type: "http", reason: `upstream status ${response.status}` };
  });
}

/**
 * Description: Stores one lead under the documented MapPack contract without retrying.
 * Inputs: request supplies host and referer; payload is validated; both secrets must be valid together.
 * Output: "sent" for valid 200/201 acceptance, even when owner text failed; test keys validate only.
 * Examples: Both absent secrets return "skipped"; a 401 logs a revoked-key failure and returns "failed".
 */
async function storeLead(request: Request, payload: ContactPayload, env: ContactEnv): Promise<DeliveryOutcome> {
  const { MAPPACK_LEADS_URL: endpoint, MAPPACK_LEAD_KEY: key } = env;
  if (endpoint === undefined && key === undefined) {
    console.info("booking lead skipped: configuration both lead secrets absent");
    return "skipped";
  }
  if (!endpoint || !key) return failed("lead", { type: "configuration", reason: "both lead secrets required" });
  try {
    const url = new URL(endpoint);
    if (endpoint !== endpoint.trim() || url.protocol !== "https:" || url.username || url.password ||
        url.pathname !== "/api/leads" || url.search || url.hash) throw new Error();
  } catch {
    return failed("lead", { type: "configuration", reason: "invalid HTTPS lead endpoint" });
  }
  if (/[^\x21-\x7e]/.test(key)) return failed("lead", { type: "configuration", reason: "invalid lead key format" });
  return deliver("lead", async (signal) => {
    const fields = {
      source: new URL(request.url).host.slice(0, 80), name: payload.name, phone: payload.phone,
      city: payload.city, service: payload.service, urgency: payload.urgency,
      preferred_time: payload.time, details: payload.message,
      page_url: (request.headers.get("Referer") ?? "").trim().slice(0, 500),
    };
    // Form-start time survives retries across server minutes; unchanged fields on that form share a key.
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(
      JSON.stringify([fields, Math.floor(payload.startedAt / 60_000)]),
    ));
    const idempotencyKey = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const response = await fetch(endpoint, {
      method: "POST", redirect: "manual", signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(fields),
    });
    if (response.status !== 200 && response.status !== 201) {
      const reason = response.status === 401 ? "unknown or revoked lead key (401)"
        : response.status === 429 ? "rate limited (429)" : `upstream status ${response.status}`;
      return { type: "http", reason };
    }
    const body: unknown = await response.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body) ||
        !("lead_id" in body) || typeof body.lead_id !== "string" ||
        !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(body.lead_id) ||
        !("owner_text" in body) || !["sent", "skipped", "failed"].includes(body.owner_text as string)) {
      return { type: "response", reason: "invalid stored-lead response" };
    }
    if (body.owner_text === "failed") console.error("booking owner_text failed: upstream MapPack reported failed");
    return null;
  });
}

/**
 * Description: Bounds a complete delivery, including its response body, even if fetch ignores abort.
 * Inputs: channel names a private log label; send returns only fixed failure metadata or null on delivery.
 * Output: "sent" or "failed" within 8 seconds, with one redacted type and reason for each failure.
 * Examples: A hung email is aborted after 8 seconds; a rejected fetch logs a generic network failure.
 */
async function deliver(
  channel: DeliveryChannel,
  send: (signal: AbortSignal) => Promise<DeliveryFailure | null>,
): Promise<DeliveryOutcome> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<DeliveryFailure>((resolve) => {
    timer = setTimeout(() => {
      resolve({ type: "timeout", reason: "delivery exceeded 8 seconds" });
      controller.abort();
    }, DELIVERY_TIMEOUT_MS);
  });
  try {
    const failure = await Promise.race([send(controller.signal), deadline]);
    return failure ? failed(channel, failure) : "sent";
  } catch {
    return failed(channel, { type: "network", reason: "request failed" });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Description: Records delivery failures without exposing visitor or upstream-controlled text.
 * Inputs: channel and failure contain only internal labels and numeric HTTP statuses.
 * Output: "failed" after one log line containing a type and reason.
 * Examples: A lead 429 logs "booking lead failed: http rate limited (429)".
 */
function failed(channel: DeliveryChannel, failure: DeliveryFailure): DeliveryOutcome {
  console.error(`booking ${channel} failed: ${failure.type} ${failure.reason}`);
  return "failed";
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
  const urgency = text("urgency", 40);
  const time = text("time", 40);
  const message = text("message", 2_000);
  const companyWebsite = text("companyWebsite", 200);
  if (
    name === null ||
    phone === null ||
    city === null ||
    service === null ||
    urgency === null ||
    (urgency !== "" && !URGENCY_OPTIONS.some((option) => option === urgency)) ||
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
    urgency,
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
    `How soon: ${payload.urgency || "Not specified"}`,
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
