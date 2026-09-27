import { CallToAction } from "./SiteContent";

/**
 * Description: Holds the latest mockup's service-area route without publishing an unapproved territory.
 * Inputs: None; the owner must supply the operating base and exact cities served.
 * Output: A review-safe page with an explicit service-area placeholder and contact links.
 * Examples: App.test.tsx opens #areas and checks that the placeholder remains visible.
 */
export default function AreasPage() {
  return (
    <div className="view is-active" data-view="areas">
      <section className="block areas-page">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <span>/</span>
            <span>Service area</span>
          </nav>
          <h1 tabIndex={-1}>Service area</h1>
          <p className="lead">
            [Confirm the business location and every city served before launch.]
          </p>
          <div className="area-review">
            <div>
              <h2 className="h2">Is your home in range?</h2>
              <p className="lead">
                Call (206) 671-8888 or send a request with your city. We will
                confirm whether we can visit your address.
              </p>
            </div>
            <div className="ph area-map-placeholder">
              <b>MAP: Approved service area</b>
              <small>Replace after the owner confirms the territory.</small>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap">
        <CallToAction title="Ask whether we serve your address." />
      </div>
    </div>
  );
}
