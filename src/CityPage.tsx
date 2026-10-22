import { SERVICES } from "./content";
import { AGENT_READABLE_CITY_SLUGS, CITY_OPTION_PAGES, CITY_PAGE_COPY, CITY_SERVICE_PAGES, cityAnswer, cityHeading, cityLandmarksText, cityOptionLabel, cityServiceMenu, serviceHrefFor, type CityPageMatch } from "./cities";
import { routeHref } from "./sitePaths";
import { Arrow, CallToAction } from "./SiteContent";

/**
 * Description: Shows one served city, answer first, with the way into each service. A city page links
 * every service; a city-and-service page links the service's own options and its full page. Requested
 * search topics include practical guidance without inventing local projects or credentials.
 * Inputs: page is a resolved city page from cityPageAt().
 * Output: Breadcrumb, heading, the answer, the landmarks sentence when known, service links and the
 * call to action.
 * Examples: CityPages.test.tsx renders Bellevue with six city-specific service links;
 * unselected cities keep links to the general service pages.
 */
export default function CityPage({ page }: { page: CityPageMatch }) {
  const { city, service } = page;
  const landmarks = cityLandmarksText(page);
  const indexedJourney = AGENT_READABLE_CITY_SLUGS.includes(city.slug);
  return (
    <div className="view is-active" data-view="areas">
      <section className="block areas-page">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={routeHref("home")}>Home</a>
            <span>/</span>
            <a href={routeHref("areas")}>Areas we serve</a>
            <span>/</span>
            {service ? (
              <>
                <a href={routeHref(`areas/${city.slug}`)}>{city.name}</a>
                <span>/</span>
                <span>{service.tab}</span>
              </>
            ) : (
              <span>{city.name}</span>
            )}
          </nav>
          <h1 tabIndex={-1}>{cityHeading(page)}</h1>
          <p className="lead">{cityAnswer(page)}</p>
          {landmarks && <p className="lead">{landmarks}</p>}
          {CITY_PAGE_COPY[page.route]?.sections.map((section) => (
            <section className="other" key={section.heading}>
              <h2>{section.heading}</h2>
              <p className="lead">{section.text}</p>
            </section>
          ))}
          <div className="other">
            <h2>{service ? `${service.tab} in ${city.name}` : `Services in ${city.name}`}</h2>
            <nav className="svc-tabs" aria-label={service ? `${service.tab} in ${city.name}` : `Services in ${city.name}`}>
              {service
                ? cityServiceMenu(service, page).map((label) => (
                    <a className="chip" href={serviceHrefFor(page, service.id, label)} key={label}>{cityOptionLabel(service.id, label)}</a>
                  ))
                : SERVICES.map((item) => {
                    const destination = CITY_SERVICE_PAGES.find((entry) => entry.citySlug === city.slug && entry.serviceId === item.id);
                    return <a className="chip" href={serviceHrefFor(page, item.id)} key={item.id}>{destination?.label ?? item.tab}</a>;
                  })}
            </nav>
            {service && (
              <p>
                <a className="link-arrow" href={routeHref(service.id)}>
                  More about {service.tab.toLowerCase()} <Arrow />
                </a>
              </p>
            )}
          </div>
          {!service && indexedJourney && (
            <section className="other">
              <h2>All services in {city.name}</h2>
              {SERVICES.map((item) => (
                <section key={item.id}>
                  <h3><a href={serviceHrefFor(page, item.id)}>{item.tab}</a></h3>
                  <ul>
                    {CITY_OPTION_PAGES.filter((option) => option.citySlug === city.slug && option.serviceId === item.id).map((option) => (
                      <li key={option.route}><a href={routeHref(option.route)}>{cityOptionLabel(item.id, option.detail.item)}</a></li>
                    ))}
                  </ul>
                </section>
              ))}
            </section>
          )}
        </div>
      </section>
      <div className="wrap">
        <CallToAction title={service ? `Talk to us about your ${service.cta} in ${city.name}.` : `Need a plumber in ${city.name}? Call us.`} />
      </div>
    </div>
  );
}
