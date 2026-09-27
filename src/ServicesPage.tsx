import { CallToAction, ServiceTiles } from "./SiteContent";

/**
 * Description: Renders the supplied services reference as native React markup.
 * Inputs: None; all business copy remains a review draft.
 * Output: The reference page with real links and explicit photo placeholders.
 * Examples: App.test.tsx verifies this page's heading and shared links.
 */
export default function ServicesPage() {
  return (
    <div className="view is-active" data-view="services">
      <section className="svc-index">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <span>/</span>
            <span>Services</span>
          </nav>
          <h1 tabIndex={-1}>Our services</h1>
          <p className="lead" style={{ maxWidth: "640px" }}>
            Choose a service to see what we do. Not sure what you need? Call us
            and describe the problem.
          </p>
        </div>
      </section>
      <section className="block" style={{ paddingTop: "40px" }}>
        <div className="wrap">
          <ServiceTiles />
        </div>
      </section>
      <div className="wrap">
        <CallToAction title="Not sure which service you need?" />
      </div>
    </div>
  );
}
