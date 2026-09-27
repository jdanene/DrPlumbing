import { useEffect, useRef, useState, type FormEvent } from "react";
import { CITIES, SERVICES } from "./content";
import { validateBooking, type BookingErrors } from "./booking";

/**
 * Description: Lets reviewers try booking without sending or saving customer information.
 * Inputs: service is the last visited service label; unknown or missing labels default to Not sure.
 * Output: A validated, editable request preview. Leaving the page discards its local form state.
 * Examples: BookingPage.test.tsx checks validation, selected service, summary, editing, and no submission claims.
 */
export default function BookingPage({ service }: { service?: string }) {
  const [errors, setErrors] = useState<BookingErrors>({});
  const [summary, setSummary] = useState<[string, string][] | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const selectedService = SERVICES.some((item) => item.tab === service)
    ? service
    : "Not sure";
  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  /**
   * Description: Builds an in-memory preview after validating the callback fields.
   * Inputs: event is the booking form submission; browser navigation is canceled.
   * Output: Field errors and focus, or a summary. It sends no request and stores nothing remotely.
   * Examples: BookingPage.test.tsx submits invalid and valid requests, then edits a preview.
   */
  function previewRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const nextErrors = validateBooking(name, phone);
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) {
      if (nextErrors.name) nameRef.current?.focus();
      else phoneRef.current?.focus();
      return;
    }
    const rows: [string, string][] = [
      ["Name", name],
      ["Phone", phone],
      ["City", String(form.get("city"))],
      ["Service", String(form.get("service"))],
      ["Best time", String(form.get("time"))],
    ];
    const details = String(form.get("message") ?? "").trim();
    if (details) rows.push(["Details", details]);
    setSummary(rows);
  }

  return (
    <div className="view is-active" data-view="book">
      <div className="wrap book">
        <div className="intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <span>/</span>
            <span>Book a visit</span>
          </nav>
          <h1 tabIndex={-1}>Book a visit.</h1>
          <p className="lead">
            Tell us what is going on. We will call you to confirm a time and
            give you a flat-rate price before any work starts.
          </p>
          <div className="drawer-phone" style={{ marginTop: 4 }}>
            <span className="muted">Prefer to talk? Call us.</span>
            <a href="tel:2066718888">
              <b>(206) 671-8888</b>
            </a>
          </div>
        </div>
        <div className="panel">
          <form
            id="bookForm"
            noValidate
            onSubmit={previewRequest}
            hidden={summary !== null}
            aria-describedby="booking-demo"
          >
            <div className="two">
              <div className={`field${errors.name ? " bad" : ""}`}>
                <label htmlFor="bName">Your name</label>
                <input
                  ref={nameRef}
                  id="bName"
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                <span className="err" id="name-error" hidden={!errors.name}>
                  {errors.name}
                </span>
              </div>
              <div className={`field${errors.phone ? " bad" : ""}`}>
                <label htmlFor="bPhone">Phone</label>
                <input
                  ref={phoneRef}
                  id="bPhone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                <span className="err" id="phone-error" hidden={!errors.phone}>
                  {errors.phone}
                </span>
              </div>
            </div>
            <div className="two">
              <div className="field">
                <label htmlFor="bCity">City</label>
                <select id="bCity" name="city" defaultValue="Newcastle">
                  {CITIES.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="bService">Service</label>
                <select
                  id="bService"
                  name="service"
                  defaultValue={selectedService}
                >
                  {SERVICES.map((item) => (
                    <option key={item.id}>{item.tab}</option>
                  ))}
                  <option>Not sure</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="bMsg">What is going on?</label>
              <textarea
                id="bMsg"
                name="message"
                placeholder="Example: water heater is leaking from the bottom"
              />
            </div>
            <fieldset className="field">
              <legend>Best time to reach you</legend>
              <div className="times">
                {["Morning", "Afternoon", "Evening"].map((time) => (
                  <label key={time}>
                    <input
                      type="radio"
                      name="time"
                      value={time}
                      defaultChecked={time === "Morning"}
                    />{" "}
                    {time}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: "100%" }}
            >
              Preview request
            </button>
            <p className="demo-note" id="booking-demo">
              Demo site: this form does not send anything. Use sample details
              only.
            </p>
          </form>
          {summary && (
            <div className="done">
              <div className="ok" aria-hidden="true">
                ✓
              </div>
              <h2
                ref={summaryRef}
                tabIndex={-1}
                style={{ fontSize: 34, fontWeight: 800 }}
              >
                Request preview.
              </h2>
              <p className="muted">
                Nothing was sent or booked. On the live site, this request would
                go to Dr Plumbing &amp; Heating for a callback.
              </p>
              <dl className="summary">
                {summary.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="cta-row" style={{ width: "100%" }}>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => {
                    setSummary(null);
                    requestAnimationFrame(() => nameRef.current?.focus());
                  }}
                >
                  Edit request
                </button>
                <a className="btn btn-primary" href="#home">
                  Back to home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
