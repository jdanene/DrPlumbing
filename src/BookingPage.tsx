import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { CITIES, SERVICES } from "./content";
import { validateBooking, type BookingErrors } from "./booking";

type SendState = "idle" | "sending" | "sent" | "error";

/**
 * Description: Sends a validated callback request to the site's server-side contact endpoint.
 * Inputs: service is the last visited service label; unknown or missing labels default to Not sure.
 * Output: Loading, success, and recoverable error states. Successful requests reach the configured business inbox.
 * Examples: BookingPage.test.tsx checks validation, request payloads, success, failure, and editing.
 */
export default function BookingPage({ service }: { service?: string }) {
  const [errors, setErrors] = useState<BookingErrors>({});
  const [summary, setSummary] = useState<[string, string][] | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formStartedAt = useRef(0);
  const selectedService = SERVICES.some((item) => item.tab === service)
    ? service
    : "Not sure";

  useEffect(() => {
    if (sendState === "sent") successRef.current?.focus();
  }, [sendState]);

  useEffect(() => {
    if (formStartedAt.current === 0) formStartedAt.current = Date.now();
  }, []);

  /**
   * Description: Validates the form and asks the server to email the business inbox.
   * Inputs: event is one browser form submission; navigation is canceled and values are trimmed.
   * Output: Field errors, a sending state, a success summary, or a retry message. Customer data is never logged.
   * Examples: BookingPage.test.tsx sends one valid request and recovers from a rejected request.
   */
  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const nextErrors = validateBooking(name, phone);
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) {
      (nextErrors.name ? nameRef : phoneRef).current?.focus();
      return;
    }

    const city = String(form.get("city") ?? "").trim();
    const requestedService = String(form.get("service") ?? "").trim();
    const time = String(form.get("time") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const rows: [string, string][] = [
      ["Name", name],
      ["Phone", phone],
      ["City", city],
      ["Service", requestedService],
      ["Best time", time],
    ];
    if (message) rows.push(["Details", message]);

    setSendState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city,
          service: requestedService,
          time,
          message,
          companyWebsite: String(form.get("companyWebsite") ?? ""),
          startedAt: formStartedAt.current,
        }),
      });
      if (!response.ok) throw new Error("Contact request failed");
      setSummary(rows);
      setSendState("sent");
    } catch {
      setSendState("error");
    }
  }

  return (
    <div className="view is-active" data-view="book">
      <div className="wrap book">
        <div className="intro">
          <nav className="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><span>Book a visit</span></nav>
          <h1 tabIndex={-1}>Book a visit.</h1>
          <p className="lead">Tell us what is going on. We will call you to confirm a time. This form requests a callback; it does not book an appointment.</p>
          <div className="drawer-phone" style={{ marginTop: 4 }}><span className="muted">Prefer to talk? Call us.</span><a href="tel:2066718888"><b>(206) 671-8888</b></a></div>
        </div>
        <div className="panel">
          <form id="bookForm" noValidate onSubmit={sendRequest} hidden={sendState === "sent"} aria-describedby="booking-help booking-status">
            <div className="two">
              <div className={`field${errors.name ? " bad" : ""}`}>
                <label htmlFor="bName">Your name</label>
                <input ref={nameRef} id="bName" name="name" autoComplete="name" maxLength={80} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
                <span className="err" id="name-error" hidden={!errors.name}>{errors.name}</span>
              </div>
              <div className={`field${errors.phone ? " bad" : ""}`}>
                <label htmlFor="bPhone">Phone</label>
                <input ref={phoneRef} id="bPhone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
                <span className="err" id="phone-error" hidden={!errors.phone}>{errors.phone}</span>
              </div>
            </div>
            <div className="two">
              <div className="field"><label htmlFor="bCity">City</label><select id="bCity" name="city" defaultValue="Newcastle">{CITIES.map((city) => <option key={city}>{city}</option>)}<option>Other / not sure</option></select></div>
              <div className="field"><label htmlFor="bService">Service</label><select id="bService" name="service" defaultValue={selectedService}>{SERVICES.map((item) => <option key={item.id}>{item.tab}</option>)}<option>Not sure</option></select></div>
            </div>
            <div className="field"><label htmlFor="bMsg">What is going on?</label><textarea id="bMsg" name="message" maxLength={2000} placeholder="Example: water heater is leaking from the bottom" /></div>
            <fieldset className="field"><legend>Best time to reach you</legend><div className="times">{["Morning", "Afternoon", "Evening"].map((time) => <label key={time}><input type="radio" name="time" value={time} defaultChecked={time === "Morning"} /> {time}</label>)}</div></fieldset>
            <div className="contact-trap" aria-hidden="true"><label htmlFor="companyWebsite">Leave this field blank</label><input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" /></div>
            <button className="btn btn-primary" type="submit" disabled={sendState === "sending"} style={{ width: "100%" }}>{sendState === "sending" ? "Sending request…" : "Send request"}</button>
            <p className="demo-note" id="booking-help">Your request goes to drplumbinggroup@gmail.com. We use it only to return your call.</p>
            <p className={`form-status${sendState === "error" ? " is-error" : ""}`} id="booking-status" role={sendState === "error" ? "alert" : "status"}>{sendState === "error" ? "We could not send your request. Try again, or call (206) 671-8888." : sendState === "sending" ? "Sending your request…" : ""}</p>
          </form>
          {sendState === "sent" && summary && <Success summary={summary} headingRef={successRef} onReset={() => { setSendState("idle"); setSummary(null); formStartedAt.current = Date.now(); nameRef.current?.focus(); }} />}
        </div>
      </div>
    </div>
  );
}

/**
 * Description: Confirms a sent callback request and lets the visitor start another.
 * Inputs: summary contains the submitted display values; onReset restores the form.
 * Output: A focused success state with the submitted values and next actions.
 * Examples: BookingPage.test.tsx verifies the summary and Send another request control.
 */
function Success({ summary, headingRef, onReset }: { summary: [string, string][]; headingRef: RefObject<HTMLHeadingElement | null>; onReset: () => void }) {
  return <div className="done">
    <div className="ok" aria-hidden="true">✓</div>
    <h2 ref={headingRef} tabIndex={-1} style={{ fontSize: 34, fontWeight: 800 }}>Request sent.</h2>
    <p className="muted">Dr Plumbing &amp; Heating received your callback request. We will contact you to confirm the next step.</p>
    <dl className="summary">{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="cta-row" style={{ width: "100%" }}><button className="btn btn-outline" type="button" onClick={onReset}>Send another request</button><a className="btn btn-primary" href="#home">Back to home</a></div>
  </div>;
}
