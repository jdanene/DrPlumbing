import { routeHref } from "./sitePaths";
import { useEffect, useRef } from "react";
import {
  SERVICES,
  SERVICE_GROUPS,
  VALUES,
  serviceMenu,
  servicesForGroup,
  type Service,
} from "./content";
import {
  SERVICE_DETAILS,
  serviceDetailFor,
  serviceDetailSlug,
  serviceOptionHref,
  type ServiceDetail,
} from "./serviceDetails";
import { DETAIL_PHOTOS, SERVICE_PHOTOS } from "./projectPhotos";
import ProjectPhoto from "./ProjectPhoto";

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
 * Description: Provides the approved contact invitation from the live site.
 * Inputs: title names the problem or service being discussed.
 * Output: Booking, calling, and texting links with the next-step message.
 * Examples: SiteShell.test.tsx verifies the message and all three contact choices.
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
        <a className="btn btn-light" href={routeHref("book")}>
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
                <a className="scard-head" href={routeHref(service.id)}>
                  <h3>{service.tab}</h3>
                  <p>{service.short}</p>
                </a>
                <ul className="opts">
                  {serviceMenu(service).map((item) => (
                    <li key={item}>
                      <a className="opt" href={serviceOptionHref(service.id, item)}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="link-arrow" href={routeHref(service.id)}>
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
 * Inputs: service is the parent catalog entry; detail optionally selects its source subservice page.
 * Output: The source layout, complete educational sections, contextual navigation, and booking links.
 * Examples: ServiceDetails.test.tsx checks all detail pages, prose-only sections, sibling links, and booking context.
 */
export function ServicePage({
  service,
  detail,
}: {
  service: Service;
  detail?: ServiceDetail;
}) {
  const page = detail ?? service;
  const photo = detail
    ? DETAIL_PHOTOS[`${service.id}/${serviceDetailSlug(detail.item)}`]
    : SERVICE_PHOTOS[service.id];
  const group = SERVICE_GROUPS.find((item) => item.serviceIds.includes(service.id));
  const relatedHeading = detail ? `More in ${service.tab}` : "Other services";
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
                    href={routeHref(item.id)}
                    aria-current={item.id === service.id ? "page" : undefined}
                  >
                    {item.tab}
                  </a>
                ))}
              </span>
            ))}
          </nav>
        </div>
        <section className={`svc-hero${photo ? "" : " svc-hero--text-only"}`}>
          <div className="copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href={routeHref("home")}>Home</a>
              <span>/</span>
              <a href={routeHref("services")}>{group?.label ?? "Services"}</a>
              <span>/</span>
              {detail ? (
                <>
                  <a href={routeHref(service.id)}>{service.tab}</a>
                  <span>/</span>
                  <span>{detail.item}</span>
                </>
              ) : (
                <span>{service.tab}</span>
              )}
            </nav>
            <h1 tabIndex={-1}>{detail?.item ?? service.title}</h1>
            {(page.summary || page.lead) && <p className="lead">{page.summary ?? page.lead}</p>}
            <div className="cta-row">
              <a className="btn btn-primary" href={routeHref("book")}>
                Book a visit
              </a>
              <a className="btn btn-outline" href="tel:2066718888">
                Call (206) 671-8888
              </a>
            </div>
          </div>
          {photo && <ProjectPhoto photo={photo} priority fullFrame />}
        </section>
        {page.sections.map((section, sectionIndex) => {
          const items = section.items ?? [];
          const headIntro = (items.length > 0 || section.paras) && section.intro;
          return (
            <section
              className="svc-sec"
              id={section.heading ? serviceDetailSlug(section.heading) : undefined}
              key={section.heading ?? sectionIndex}
            >
              {(section.heading || headIntro) && (
                <div className="s-head">
                  {section.heading && <h2>{section.heading}</h2>}
                  {headIntro && <p>{headIntro}</p>}
                </div>
              )}
              <div className="s-body">
                {sectionIndex === 0 && page.summary && page.lead && <p>{page.lead}</p>}
                {section.paras?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {items.length > 0 ? (
                  <ul
                    className="items"
                    style={{
                      gridTemplateColumns: `repeat(${section.cols ?? 2},minmax(0,1fr))`,
                    }}
                  >
                    {items.map(([title, copy], index) => {
                      const itemPhoto = !detail
                        && !serviceDetailFor(service.id, title)
                        && !service.optionTargets?.[title]
                        ? DETAIL_PHOTOS[`${service.id}/${serviceDetailSlug(title)}`]
                        : undefined;
                      return (
                        <li id={serviceDetailSlug(title)} key={title}>
                          {section.numbered ? (
                            <span className="num">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          ) : section.check ? (
                            <svg
                              className="chk"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          ) : null}
                          <div className="service-item-copy">
                            <h3>{title}</h3>
                            {copy && <p>{copy}</p>}
                            {!detail && (serviceDetailFor(service.id, title) || service.optionTargets?.[title]) && (
                              <a
                                className="link-arrow"
                                href={serviceOptionHref(service.id, title)}
                                aria-label={`Read more about ${title}`}
                              >
                                Read more<span className="sr-only"> about {title}</span> <Arrow />
                              </a>
                            )}
                            {itemPhoto && itemPhoto.src !== photo?.src && (
                              <a
                                className="service-item-photo"
                                href={itemPhoto.src}
                                aria-label={`View full photo: ${itemPhoto.alt}`}
                              >
                                <ProjectPhoto photo={itemPhoto} fullFrame />
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : !section.paras && section.intro ? (
                  <p>{section.intro}</p>
                ) : null}
                {section.after?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          );
        })}
        <div className="other">
          <h2>{relatedHeading}</h2>
          <nav className="svc-tabs" aria-label={relatedHeading}>
            {detail ? (
              <>
                {(SERVICE_DETAILS[service.id] ?? [])
                  .filter((item) => item !== detail)
                  .map((item) => (
                    <a
                      className="chip"
                      href={serviceOptionHref(service.id, item.item)}
                      key={item.item}
                    >
                      {item.item}
                    </a>
                  ))}
                <a className="chip" href={routeHref(service.id)}>See all</a>
              </>
            ) : (
              SERVICES.filter((item) => item.id !== service.id).map((item) => (
                <a className="chip" href={routeHref(item.id)} key={item.id}>
                  {item.tab}
                </a>
              ))
            )}
          </nav>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 48 }}>
        <CallToAction title={`Talk to us about your ${page.cta}.`} />
      </div>
    </div>
  );
}
