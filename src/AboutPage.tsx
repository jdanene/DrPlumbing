import { CallToAction, Values } from "./SiteContent";

/**
 * Description: Renders the supplied About reference as native React markup.
 * Inputs: None; all business copy remains a review draft.
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
              <a href="#home">Home</a>
              <span>/</span>
              <span>About us</span>
            </nav>
            <h1 tabIndex={-1}>A family business on your street.</h1>
            <p className="lead">
              Dr Plumbing &amp; Heating is family owned and run from Newcastle,
              Washington. We work in homes from Everett to Kent.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#book">
                Book a visit
              </a>
              <a className="btn btn-outline" href="#services">
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
              I have worked in plumbing and heating for{" "}
              <span className="fill">[number]</span> years. In{" "}
              <span className="fill">[year]</span>, I started my own company to
              do honest work at a fair price.
            </p>
            <p>
              My family and I live in <span className="fill">[City]</span>.{" "}
              <span className="fill">
                [One or two sentences about your family: who they are and what
                you do together.]
              </span>
            </p>
            <p>
              When you call, you get a straight answer and a flat-rate price
              before we start. If I would not do it in my own house, I will not
              recommend it for yours.
            </p>
            <div className="signature">
              <span className="sig">[First name]</span>
              <small>Owner, Dr Plumbing &amp; Heating</small>
            </div>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <div className="why">
            <h2 className="h2">What we stand for.</h2>
            <Values />
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
