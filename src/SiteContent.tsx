import { useEffect, useRef } from "react";
import {
  SERVICES,
  SERVICE_GROUPS,
  VALUES,
  serviceMenu,
  servicesForGroup,
  type Service,
} from "./content";

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
          Call or text <span className="phone-text">(206) 671-8888</span>, or
          send a request online. We will confirm the next step.
        </p>
      </div>
      <div className="cta-row">
        <a className="btn btn-light" href="#book">
          Book a visit
        </a>
        <a className="btn btn-ghost-light" href="tel:2066718888">
          Call now
        </a>
        <a className="btn btn-ghost-light" href="sms:+12066718888">
          Text us
        </a>
      </div>
    </div>
  );
}

/**
 * Description: Groups the latest mockup's services by the kind of work a visitor needs.
 * Inputs: None; the catalog owns group order, labels, descriptions, and destinations.
 * Output: Two labeled groups with service summaries and direct job links.
 * Examples: App.test.tsx checks every service and both group labels in the services index.
 */
export function ServiceFinder() {
  return (
    <div className="finder">
      {SERVICE_GROUPS.map((group) => (
        <section className="fgroup" key={group.id}>
          <div className="fg-label">
            <h3>{group.label}</h3>
            <p>{group.blurb}</p>
          </div>
          <div className="fg-cards">
            {servicesForGroup(group).map((service) => (
              <article
                className={`scard${serviceMenu(service).length > 6 ? " wide" : ""}`}
                key={service.id}
              >
                <a className="scard-head" href={`#${service.id}`}>
                  <h3>{service.tab}</h3>
                  <p>{service.short}</p>
                </a>
                <ul className="opts">
                  {serviceMenu(service).map((item) => (
                    <li key={item}>
                      <a className="opt" href={`#${service.id}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="link-arrow" href={`#${service.id}`}>
                  More about {service.tab.toLowerCase()} <Arrow />
                </a>
              </article>
            ))}
          </div>
        </section>
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
            {SERVICE_GROUPS.map((group) => (
              <span className="tab-group" key={group.id}>
                <span className="tab-label">{group.label}</span>
                {servicesForGroup(group).map((item) => (
                  <a
                    key={item.id}
                    className="chip"
                    href={`#${item.id}`}
                    aria-current={item.id === service.id ? "page" : undefined}
                  >
                    {item.tab}
                  </a>
                ))}
              </span>
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
