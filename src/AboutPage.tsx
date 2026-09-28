import { routeHref } from "./sitePaths";
import { CallToAction } from "./SiteContent";

const ABOUT_VALUES = [
  ["Expert team", "Our expert team goes above and beyond to ensure you have the best customer experience possible. We work with the same precision and care from start to finish, regardless of the size of the job. Whether you need a quick drain cleaning or a comprehensive re-piping, we have you covered. You can be confident that we will complete the repair or installation and have your home back in working order in no time."],
  ["Homeowners like you have put their trust in us.", "Enjoy the peace of mind that comes from working with a reputable plumber. Our HomeAdvisor trust certification ensures that you can have faith in the technician who enters your home. We take pride in hiring only the most professional, dependable technicians who are dedicated to providing the highest level of quality in everything they do. When you select Dr Plumbing & Heating, you are selecting the quality that you deserve."],
  ["Sincere, flat-rate pricing", "With our flat-rate pricing, you always know what to expect before we begin service. Enjoy peace of mind knowing that there will be no unexpected fees or charges at the end."],
  ["Go the extra mile", "We understand you have many options for plumbing services, but we believe we are your best option. When you choose us, we express our gratitude by going above and beyond to ensure a flawless experience."],
  ["Our top priority is your safety.", "We understand how important it is to have a safe and comfortable home. If your plumbing is in disrepair or improperly installed, it can expose your home to hazards and contamination. That is why we have come! Our professional technicians are well-versed in the most up-to-date methods and equipment. You can relax knowing that you are getting the safest and most effective plumbing installations and repairs."],
] as const;

/**
 * Description: Renders the supplied About reference as native React markup.
 * Inputs: None; the supplied mockup defines the business copy.
 * Output: The reference page with real links and explicit photo placeholders.
 * Examples: App.test.tsx verifies this page's heading and shared links.
 */
export default function AboutPage() {
  return (
    <div className="view is-active" data-view="about">
      <section>
        <div className="wrap about-hero">
          <div className="copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href={routeHref("home")}>Home</a>
              <span>/</span>
              <span>About us</span>
            </nav>
            <h1 tabIndex={-1}>A family business on your street.</h1>
            <p className="lead">
              Dr Plumbing &amp; Heating is family owned and run from Seattle,
              Washington. We work in homes from Everett to Federal Way.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={routeHref("book")}>
                Book a visit
              </a>
              <a className="btn btn-outline" href={routeHref("services")}>
                See services
              </a>
            </div>
          </div>
          <div className="ph">
            <svg
              width="40"
              height="40"
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
            <b>PHOTO: The owner and his family, smiling</b>
            <small>
              The biggest photo on the page. Relaxed, outdoors, natural light.
            </small>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap letter">
          <div className="ph">
            <b>PHOTO: Owner beside the van, in uniform</b>
          </div>
          <div className="copy">
            <div className="eyebrow">A note from the owner</div>
            <h2 className="h2">Why I started Dr Plumbing &amp; Heating.</h2>
            <p>
              I have worked in plumbing and heating for 26+ years. In{" "}
              <span className="fill">[year]</span>, I started my own company to
              do honest work at a fair price.
            </p>
            <p>
              My family and I live in Seattle.
            </p>
            <p>
              When you call, you get a straight answer and a flat-rate price
              before we start. If I would not do it in my own house, I will
              not recommend it for yours.
            </p>
            <div className="signature">
              <span className="sig">Mehran</span>
              <small>Owner, Dr Plumbing &amp; Heating</small>
            </div>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <div className="why">
            <h2 className="h2">Why choose us?</h2>
            <div className="why-intro">
              {ABOUT_VALUES.map(([title, copy]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <div className="block-head">
            <div>
              <div className="eyebrow">Behind the van</div>
              <h2 className="h2">The people who come to your home.</h2>
            </div>
          </div>
          <div className="strip">
            <div className="ph">
              <b>PHOTO: A family moment</b>
            </div>
            <div className="ph">
              <b>PHOTO: Owner with a customer</b>
            </div>
            <div className="ph">
              <b>PHOTO: The van at a job</b>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <CallToAction title="We would like to meet you." />
      </div>
    </div>
  );
}
