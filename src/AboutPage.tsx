import { routeHref } from "./sitePaths";
import { CallToAction } from "./SiteContent";
import ProjectPhoto from "./ProjectPhoto";
import { PHOTOS } from "./projectPhotos";

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
 * Output: The business story, working photographs and service links.
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
              Dr Plumbing &amp; Heating is family owned and run from Newcastle,
              Washington. We serve the Greater Seattle area, from Everett to
              Federal Way.
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
          <ProjectPhoto photo={PHOTOS.technician} priority />
        </div>
      </section>

      <section className="block">
        <div className="wrap letter">
          <ProjectPhoto photo={PHOTOS.technicianFiltration} />
          <div className="copy">
            <div className="eyebrow">A note from the owner</div>
            <h2 className="h2">Why I started Dr Plumbing &amp; Heating.</h2>
            <p>
              I have worked in plumbing and heating for 26+ years. I started my
              own company to do honest work at a fair price.
            </p>
            <p>
              My family and I live in Newcastle, WA. We serve the Greater Seattle
              area, from Everett to Federal Way.
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
              <div className="eyebrow">On the job</div>
              <h2 className="h2">Our team at work.</h2>
            </div>
          </div>
          <div className="strip">
            <ProjectPhoto photo={PHOTOS.pipeAlignment} fullFrame />
            <ProjectPhoto photo={PHOTOS.boilerWork} fullFrame />
            <ProjectPhoto photo={PHOTOS.welding} fullFrame />
          </div>
        </div>
      </section>

      <div className="wrap">
        <CallToAction title="We would like to meet you." />
      </div>
    </div>
  );
}
