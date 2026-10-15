import { routeHref } from "./sitePaths";
import { CITY_PAGES } from "./cities";
import { SERVICE_AREA_MAP_URL, SERVICE_GROUPS, servicesForGroup } from "./content";
import { CallToAction } from "./SiteContent";

/**
 * Description: Shows the supplied service-area page and its city list.
 * Inputs: None; cities come from the business record through CITY_PAGES.
 * Output: A link to each city's page and service links beside the map, with a phone link for other addresses.
 * Examples: CityPages.test.tsx checks every served city renders as a link to its page.
 */
export default function AreasPage() {
  return (
    <div className="view is-active" data-view="areas">
      <section className="block areas-page">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={routeHref("home")}>Home</a>
            <span>/</span>
            <span>Areas we serve</span>
          </nav>
          <h1 tabIndex={-1}>Areas we serve</h1>
          <p className="lead">
            Dr Plumbing &amp; Heating serves homes across the Greater Seattle
            area and the Eastside, from Everett to Federal Way. We're based in
            Newcastle, WA.
          </p>
          <div className="area" style={{ marginTop: 40, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h2 className="h2">Cities in King and Snohomish counties</h2>
              <ul className="cities">
                {CITY_PAGES.map((city) => (
                  <li key={city.slug}><a href={routeHref(`areas/${city.slug}`)}>{city.name}</a></li>
                ))}
              </ul>
            </div>
            <div className="map-card">
              <iframe
                title="Map of Seattle, Washington"
                src={SERVICE_AREA_MAP_URL}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a className="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=Seattle%2C%20WA" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>
          </div>
          <div className="area-services">
            <h2 className="h2">Services in every area</h2>
            <nav className="svc-tabs" aria-label="Services in every area">
              {SERVICE_GROUPS.map((group) => (
                <div className="area-service-group" key={group.id}>
                  <h3 className="tab-label">{group.label}</h3>
                  <div className="area-service-links">
                    {servicesForGroup(group).map((service) => (
                      <a className="chip" href={routeHref(service.id)} key={service.id}>{service.tab}</a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>
      <div className="wrap">
        <CallToAction title="Don't see your city? Call us." />
      </div>
    </div>
  );
}
