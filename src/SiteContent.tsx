import { routeHref } from "./sitePaths";
import { Fragment, useEffect, useRef } from "react";
import {
  SERVICES,
  SERVICE_GROUPS,
  VALUES,
  servicesForGroup,
  type Service,
} from "./content";
import {
  SERVICE_DETAILS,
  serviceDetailFor,
  serviceDetailSlug,
  serviceOptionHref,
  serviceNavigationMenu,
  type ServiceDetail,
} from "./serviceDetails";
import { DETAIL_PHOTOS, SERVICE_GALLERIES, SERVICE_PHOTOS, type WorkProject } from "./projectPhotos";
import ProjectPhoto from "./ProjectPhoto";
import { cityAnswer, cityHeading, optionLabel, cityServiceMenu, serviceHrefFor, type CityPageMatch } from "./cities";
import { SERVICE_ANSWERS } from "./content/serviceAnswers";

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
                className={`scard${serviceNavigationMenu(service).length > 6 ? " wide" : ""}`}
                key={service.id}
              >
                <a className="scard-head" href={routeHref(service.id)}>
                  <h3>{service.tab}</h3>
                  <p>{service.short}</p>
                </a>
                <ul className="opts">
                  {serviceNavigationMenu(service).map((item) => (
                    <li key={item}>
                      <a className="opt" href={serviceOptionHref(service.id, item)}>
                        {optionLabel(service.id, item)}
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
 * Description: Shows project evidence beside its service explanation without cropping the work.
 * Inputs: projects contains selected photographs and factual captions in display order; city optionally localizes each image's alt text.
 * Output: Full-frame images linked to their originals; an empty collection renders no figures.
 * Examples: ResidentialProjects.test.tsx checks fixture, shower and kitchen photos inside their sections.
 */
function ProjectGallery({ projects, city }: { projects: WorkProject[]; city?: string }) {
  return (
    <div className="service-project-gallery">
      {projects.map(project => (
        <figure key={project.photo.src}>
          <a href={project.photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${project.title}`}>
            <ProjectPhoto photo={project.photo} city={city} fullFrame />
          </a>
          <figcaption>{project.description}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * Description: Renders every service through one layout so service changes stay in the catalog.
 * Inputs: service is the parent catalog entry; detail selects an option; cityPage optionally supplies location context.
 * Output: The same source layout, photos and educational sections, with city-aware links and wording when supplied.
 * Examples: ServiceDetails.test.tsx checks all detail pages, prose-only sections, sibling links, and booking context.
 */
export function ServicePage({
  service,
  detail,
  cityPage,
}: {
  service: Service;
  detail?: ServiceDetail;
  cityPage?: CityPageMatch;
}) {
  const page = detail ?? service;
  const repairAnswer = cityPage && service.id === "water-heaters" && detail?.item === "Water heater repair"
    ? SERVICE_ANSWERS["water-heaters/water-heater-repair"] : undefined;
  const usesCategoryArtwork = cityPage && detail && !DETAIL_PHOTOS[`${service.id}/${serviceDetailSlug(detail.item)}`] && !serviceDetailFor(service.id, detail.item);
  const photo = detail && !usesCategoryArtwork
    ? DETAIL_PHOTOS[`${service.id}/${serviceDetailSlug(detail.item)}`]
    : SERVICE_PHOTOS[service.id];
  const gallery = SERVICE_GALLERIES[detail && !usesCategoryArtwork ? `${service.id}/${serviceDetailSlug(detail.item)}` : service.id];
  const group = SERVICE_GROUPS.find((item) => item.serviceIds.includes(service.id));
  const isBathroomRemodeling = service.id === "plumbing" && detail?.item === "Complete bathroom remodeling";
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
  }, [service.id, detail?.item]);
  return (
    <div className="view is-active" data-view="service">
      <div className="wrap">
        <div style={{ paddingTop: 20 }}>
          <nav className="svc-tabs" aria-label="Services" ref={tabsRef}>
            {SERVICE_GROUPS.map((group) => (
              <span className="tab-group" key={group.id}>
                <span className="tab-label">{group.label}</span>
                {servicesForGroup(group).map((item) => (
                  <Fragment key={item.id}>
                    <a
                      className="chip"
                      href={serviceHrefFor(cityPage, item.id)}
                      aria-current={item.id === service.id && !isBathroomRemodeling ? "page" : undefined}
                    >
                      {item.tab}
                    </a>
                    {item.id === "plumbing" && (
                      <a
                        className="chip"
                        href={serviceHrefFor(cityPage, "plumbing", "Complete bathroom remodeling")}
                        aria-current={isBathroomRemodeling ? "page" : undefined}
                      >
                        Bathroom remodeling
                      </a>
                    )}
                  </Fragment>
                ))}
              </span>
            ))}
          </nav>
        </div>
        <section className={`svc-hero${photo ? "" : " svc-hero--text-only"}${!detail && service.id === "plumbing" ? " svc-hero--plumbing" : ""}`}>
          <div className="copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href={routeHref("home")}>Home</a>
              <span>/</span>
              <a href={routeHref(cityPage ? "areas" : "services")}>{cityPage ? "Areas we serve" : group?.label ?? "Services"}</a>
              {cityPage && <><span>/</span><a href={routeHref(`areas/${cityPage.city.slug}`)}>{cityPage.city.name}</a></>}
              <span>/</span>
              {detail ? (
                <>
                  <a href={serviceHrefFor(cityPage, service.id)}>{service.tab}</a>
                  <span>/</span>
                  <span>{optionLabel(service.id, detail.item)}</span>
                </>
              ) : (
                <span>{service.tab}</span>
              )}
            </nav>
            <h1 tabIndex={-1}>{cityPage ? cityHeading(cityPage) : detail ? optionLabel(service.id, detail.item) : service.title}</h1>
            {repairAnswer ? <div className="service-repair-answer">
              <h2>{repairAnswer.question.replaceAll("{city}", cityPage!.city.name)}</h2>
              <p className="lead">{repairAnswer.answer.replaceAll("{city}", cityPage!.city.name)}</p>
            </div> : cityPage ? <p className="lead">{cityAnswer(cityPage)}</p> : (page.summary || page.lead) && <p className="lead">{page.summary ?? page.lead}</p>}
            {detail?.item === "Emergency plumber" ? (
              <div className="cta-row">
                <a className="btn btn-primary" href="tel:2066718888">
                  Call (206) 671-8888
                </a>
                <a className="btn btn-outline" href={routeHref("book")}>
                  Book a visit
                </a>
              </div>
            ) : (
              <div className="cta-row">
                <a className="btn btn-primary" href={routeHref("book")}>
                  Book a visit
                </a>
                <a className="btn btn-outline" href="tel:2066718888">
                  Call (206) 671-8888
                </a>
              </div>
            )}
          </div>
          {photo && <ProjectPhoto photo={photo} city={cityPage?.city.name} priority fullFrame />}
        </section>
        {cityPage && !detail && (
          <div className="other">
            <h2>{service.tab} in {cityPage.city.name}</h2>
            <nav className="svc-tabs" aria-label={`${service.tab} in ${cityPage.city.name}`}>
              {cityServiceMenu(service, cityPage).map((label) => (
                <a className="chip" key={label} href={serviceHrefFor(cityPage, service.id, label)}>{optionLabel(service.id, label)}</a>
              ))}
            </nav>
          </div>
        )}
        {detail?.sectionNavigation && (
          <nav className="svc-tabs" aria-label="On this page">
            {detail.sectionNavigation.map(heading => (
              <a className="chip" key={heading} href={`#${serviceDetailSlug(heading)}`}>{heading}</a>
            ))}
          </nav>
        )}
        {page.sections.map((section, sectionIndex) => {
          const sectionGallery = detail && section.heading
            ? SERVICE_GALLERIES[`${service.id}/${serviceDetailSlug(detail.item)}#${serviceDetailSlug(section.heading)}`]
            : undefined;
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
                                href={serviceHrefFor(cityPage, service.id, title)}
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
                                <ProjectPhoto photo={itemPhoto} city={cityPage?.city.name} fullFrame />
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
                {sectionGallery && <ProjectGallery projects={sectionGallery.projects} city={cityPage?.city.name} />}
              </div>
            </section>
          );
        })}
        {gallery && (
          <section className="svc-sec" aria-label={gallery.title}>
            <div className="s-head"><h2>{gallery.title}</h2></div>
            <div className="s-body">
              <ProjectGallery projects={gallery.projects} city={cityPage?.city.name} />
            </div>
          </section>
        )}
        <div className="other">
          <h2>{relatedHeading}</h2>
          <nav className="svc-tabs" aria-label={relatedHeading}>
            {detail ? (
              <>
                {cityPage ? cityServiceMenu(service, cityPage).filter((label) => label !== detail.item).map((label) => (
                  <a className="chip" href={serviceHrefFor(cityPage, service.id, label)} key={label}>{optionLabel(service.id, label)}</a>
                )) : (SERVICE_DETAILS[service.id] ?? [])
                  .filter((item) => item !== detail && serviceNavigationMenu(service).includes(item.item))
                  .map((item) => (
                    <a
                      className="chip"
                      href={serviceOptionHref(service.id, item.item)}
                      key={item.item}
                    >
                      {optionLabel(service.id, item.item)}
                    </a>
                  ))}
                <a className="chip" href={serviceHrefFor(cityPage, service.id)}>See all</a>
              </>
            ) : (
              SERVICES.filter((item) => item.id !== service.id).map((item) => (
                <a className="chip" href={serviceHrefFor(cityPage, item.id)} key={item.id}>
                  {item.tab}
                </a>
              ))
            )}
          </nav>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 48 }}>
        <CallToAction title={`Talk to us about your ${page.cta}${cityPage ? ` in ${cityPage.city.name}` : ""}.`} />
      </div>
    </div>
  );
}
