import { useEffect, useRef } from "react";
import { SERVICES, VALUES, type Service } from "./content";

/**
 * Description: Marks a missing project photograph with the reference's camera symbol.
 * Inputs: None; adjacent text describes the required photo.
 * Output: A decorative camera, excluded from the accessible name.
 * Examples: App.test.tsx verifies service placeholders and Work filters retain their labels.
 */
export function Camera() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/**
 * Description: Draws the repeated directional cue without giving it an accessible name.
 * Inputs: None; the adjacent link supplies the name.
 * Output: A decorative arrow.
 * Examples: App.test.tsx checks service links retain their visible labels.
 */
export function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Description: Provides the shared contact invitation from the reference design.
 * Inputs: title names the problem or service being discussed.
 * Output: Booking-preview and phone links; it never submits a request.
 * Examples: App.test.tsx checks the services invitation links to #book.
 */
export function CallToAction({ title }: { title: string }) {
  return (
    <div className="cta">
      <div>
        <h2>{title}</h2>
        <p>
          Call <span className="phone-text">(206) 671-8888</span> or book
          online. Flat-rate prices, no surprise fees.
        </p>
      </div>
      <div className="cta-row">
        <a className="btn btn-light" href="#book">
          Book a visit
        </a>
        <a className="btn btn-ghost-light" href="tel:2066718888">
          Call now
        </a>
      </div>
    </div>
  );
}

/**
 * Description: Lists services consistently on the homepage and services index.
 * Inputs: None; the catalog defines the labels, descriptions, and destinations.
 * Output: Six linked tiles with explicit photo placeholders.
 * Examples: App.test.tsx checks each catalog entry has a link and description.
 */
export function ServiceTiles() {
  return (
    <div className="tiles">
      {SERVICES.map((service) => (
        <a className="tile" href={`#${service.id}`} key={service.id}>
          <div className="ph">
            <b>PHOTO</b>
            <small>{service.photo}</small>
          </div>
          <div className="t-body">
            <h3>{service.tab}</h3>
            <p>{service.short}</p>
            <span className="link-arrow">
              See details <Arrow />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

/**
 * Description: Keeps the reference's business-value copy identical on both pages.
 * Inputs: None; claims remain review-only pending owner approval.
 * Output: Four value statements.
 * Examples: App.test.tsx checks both home and About include the pricing statement.
 */
export function Values() {
  return (
    <div className="why-grid">
      {VALUES.map(([title, copy]) => (
        <div key={title}>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Description: Renders every service through one layout so service changes stay in the catalog.
 * Inputs: service is a catalog entry, including an optional empty item list for prose sections.
 * Output: Service navigation, heading, details, related services, and booking links.
 * Examples: App.test.tsx checks all six headings and the boiler's prose-only section.
 */
export function ServicePage({ service }: { service: Service }) {
  const tabsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const tabs = tabsRef.current;
    const active = tabs?.querySelector<HTMLElement>('[aria-current="page"]');
    if (tabs && active)
      tabs.scrollLeft =
        active.offsetLeft -
        tabs.offsetLeft -
        tabs.clientWidth / 2 +
        active.clientWidth / 2;
  }, [service.id]);
  return (
    <div className="view is-active" data-view="service">
      <div className="wrap">
        <div style={{ paddingTop: 20 }}>
          <nav className="svc-tabs" aria-label="Services" ref={tabsRef}>
            {SERVICES.map((item) => (
              <a
                key={item.id}
                className="chip"
                href={`#${item.id}`}
                aria-current={item.id === service.id ? "page" : undefined}
              >
                {item.tab}
              </a>
            ))}
          </nav>
        </div>
        <section className="svc-hero">
          <div className="copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="#home">Home</a>
              <span>/</span>
              <a href="#services">Services</a>
              <span>/</span>
              <span>{service.tab}</span>
            </nav>
            <h1 tabIndex={-1}>{service.title}</h1>
            <p className="lead">{service.lead}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#book">
                Book a visit
              </a>
              <a className="btn btn-outline" href="tel:2066718888">
                Call (206) 671-8888
              </a>
            </div>
          </div>
          <div className="ph">
            <Camera />
            <b>PHOTO: {service.photo}</b>
          </div>
        </section>
        {service.sections.map((section) => (
          <section className="svc-sec" key={section.heading}>
            <div className="s-head">
              <h2>{section.heading}</h2>
              {section.items.length > 0 && section.intro && (
                <p>{section.intro}</p>
              )}
            </div>
            <div className="s-body">
              {section.items.length === 0 ? (
                <p>{section.intro}</p>
              ) : (
                <ul
                  className="items"
                  style={{
                    gridTemplateColumns: `repeat(${section.cols ?? 2},minmax(0,1fr))`,
                  }}
                >
                  {section.items.map(([title, copy], index) => (
                    <li key={title}>
                      {section.numbered ? (
                        <span className="num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      ) : section.check ? (
                        <span className="chk" aria-hidden="true">
                          ✓
                        </span>
                      ) : null}
                      <div>
                        <h3>{title}</h3>
                        {copy && <p>{copy}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
        <div className="other">
          <h2>Other services</h2>
          <nav className="svc-tabs" aria-label="Other services">
            {SERVICES.filter((item) => item.id !== service.id).map((item) => (
              <a className="chip" href={`#${item.id}`} key={item.id}>
                {item.tab}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 48 }}>
        <CallToAction title={`Talk to us about your ${service.cta}.`} />
      </div>
    </div>
  );
}
