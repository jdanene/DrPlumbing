import { CallToAction, ServiceTiles, Values } from "./SiteContent";
import { CITIES } from "./content";

/**
 * Description: Renders the supplied home reference as native React markup.
 * Inputs: None; all business copy remains a review draft.
 * Output: The reference page with real links and explicit photo placeholders.
 * Examples: App.test.tsx verifies this page's heading and shared links.
 */
export default function HomePage() {
  return (
    <div className="view is-active" data-view="home">
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="h-text">
              <div className="eyebrow">Residential plumbing &amp; heating</div>
              <h1 tabIndex={-1}>
                Plumbing, heating and cooling for your home.
              </h1>
            </div>
            <div className="h-side">
              <p className="lead">
                We are a locally owned team of licensed technicians in
                Newcastle. We fix leaks, replace water heaters and keep your
                heat running, at a flat rate you approve before we start.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#book">
                  Book a visit
                  <svg
                    width="18"
                    height="18"
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
                </a>
                <a className="btn btn-outline" href="#services">
                  See services
                </a>
              </div>
            </div>
          </div>

          <div className="stage">
            <div className="rate-card">
              <div className="ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <b>Flat-rate pricing</b>
                <span>
                  You see the price first. No surprise fees at the end.
                </span>
              </div>
            </div>
            <svg
              viewBox="0 0 1000 400"
              role="img"
              aria-label="The Dr Plumbing and Heating van, a high-roof Sprinter with a white, copper and slate wrap"
            >
              <defs>
                <clipPath id="vanClip">
                  <path d="M40 300 Q40 282 58 274 L112 252 Q132 242 162 238 L256 80 Q264 62 288 60 L936 60 Q962 60 962 86 L962 332 Q962 346 948 346 L858 346 A58 58 0 0 0 742 346 L248 346 A58 58 0 0 0 132 346 L56 346 Q40 346 40 332 Z" />
                </clipPath>
              </defs>
              <ellipse
                cx="500"
                cy="392"
                rx="470"
                ry="8"
                fill="#17252B"
                opacity="0.2"
              />
              <path
                d="M40 300 Q40 282 58 274 L112 252 Q132 242 162 238 L256 80 Q264 62 288 60 L936 60 Q962 60 962 86 L962 332 Q962 346 948 346 L858 346 A58 58 0 0 0 742 346 L248 346 A58 58 0 0 0 132 346 L56 346 Q40 346 40 332 Z"
                fill="#FFFFFF"
              />
              <g clipPath="url(#vanClip)">
                <path
                  d="M840 60 L1000 60 L1000 352 L740 352 Z"
                  fill="#B4552A"
                />
                <path
                  d="M806 60 L824 60 L724 352 L706 352 Z"
                  fill="#B4552A"
                  opacity="0.45"
                />
                <rect x="0" y="282" width="1000" height="6" fill="#B4552A" />
                <rect x="0" y="288" width="1000" height="70" fill="#17252B" />
              </g>
              <path
                d="M40 300 Q40 282 58 274 L112 252 Q132 242 162 238 L256 80 Q264 62 288 60 L936 60 Q962 60 962 86 L962 332 Q962 346 948 346 L858 346 A58 58 0 0 0 742 346 L248 346 A58 58 0 0 0 132 346 L56 346 Q40 346 40 332 Z"
                fill="none"
                stroke="#17252B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M356 64 L356 286 M566 64 L566 282 M938 64 L938 282"
                stroke="#17252B"
                strokeOpacity="0.22"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M190 232 L266 102 Q272 92 284 92 L346 92 L346 232 Z"
                fill="#2B3F47"
              />
              <path
                d="M292 92 L310 92 L256 232 L238 232 Z"
                fill="#FFFFFF"
                opacity="0.14"
              />
              <rect
                x="226"
                y="156"
                width="16"
                height="40"
                rx="5"
                fill="#17252B"
              />
              <path
                d="M54 274 L104 254 L110 264 L58 284 Z"
                fill="#E7E1D6"
                stroke="#17252B"
                strokeWidth="2"
              />
              <rect
                x="952"
                y="110"
                width="10"
                height="70"
                rx="3"
                fill="#9A3B2E"
              />
              <rect
                x="318"
                y="248"
                width="22"
                height="6"
                rx="3"
                fill="#17252B"
                opacity="0.5"
              />
              <text
                x="392"
                y="176"
                fontFamily="'Bricolage Grotesque', sans-serif"
                fontWeight="800"
                fontSize="120"
                letterSpacing="-4"
                fill="#17252B"
              >
                D<tspan fill="#B4552A">R</tspan>
              </text>
              <rect x="396" y="190" width="318" height="4" fill="#B4552A" />
              <text
                x="396"
                y="222"
                fontFamily="'Public Sans', sans-serif"
                fontWeight="700"
                fontSize="22"
                letterSpacing="4.2"
                fill="#17252B"
              >
                PLUMBING &amp; HEATING
              </text>
              <text
                x="396"
                y="258"
                fontFamily="'Public Sans', sans-serif"
                fontWeight="600"
                fontSize="17"
                fill="#17252B"
                opacity="0.8"
              >
                Plumbing · Heating · Water Heaters
              </text>
              <text
                x="394"
                y="330"
                fontFamily="'Bricolage Grotesque', sans-serif"
                fontWeight="800"
                fontSize="36"
                fill="#FFFFFF"
              >
                (206) 671-8888
              </text>
              <text
                x="948"
                y="262"
                textAnchor="end"
                fontFamily="'Public Sans', sans-serif"
                fontWeight="700"
                fontSize="16"
                fill="#FFFFFF"
              >
                [website].com
              </text>
              <text
                x="272"
                y="272"
                textAnchor="middle"
                fontFamily="'Public Sans', sans-serif"
                fontWeight="600"
                fontSize="12"
                fill="#17252B"
                opacity="0.7"
              >
                Lic. [WA LICENSE #]
              </text>
              <circle cx="190" cy="346" r="46" fill="#1E2426" />
              <circle cx="190" cy="346" r="25" fill="#A7AFB2" />
              <circle cx="190" cy="346" r="8" fill="#1E2426" />
              <circle cx="800" cy="346" r="46" fill="#1E2426" />
              <circle cx="800" cy="346" r="25" fill="#A7AFB2" />
              <circle cx="800" cy="346" r="8" fill="#1E2426" />
            </svg>
            <span className="caption">
              Van wrap concept · Mercedes-Benz Sprinter
            </span>
          </div>

          <div className="trust">
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Licensed &amp; insured
            </div>
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
              </svg>
              Family owned in Newcastle
            </div>
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Emergency HVAC service
            </div>
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2l3 6.3 7 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 7-1z" />
              </svg>
              HomeAdvisor certified
            </div>
          </div>
        </div>
      </section>

      <section
        className="block"
        id="home-services"
        style={{ paddingTop: "48px" }}
      >
        <div className="wrap">
          <div className="block-head">
            <div>
              <div className="eyebrow">Services</div>
              <h2 className="h2">What do you need help with?</h2>
            </div>
            <p className="lead" style={{ maxWidth: "380px" }}>
              Pick a service to see what we do and how we price it.
            </p>
          </div>
          <ServiceTiles />
        </div>
      </section>

      <section className="block" style={{ paddingTop: "0" }}>
        <div className="wrap owner">
          <div className="photos">
            <div className="ph main">
              <svg
                width="36"
                height="36"
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
              <small>Outdoors, natural light, at home or beside the van</small>
            </div>
            <div className="ph inset">
              <b>PHOTO: Owner on a job</b>
            </div>
          </div>
          <div className="copy">
            <div className="eyebrow">Meet the owner</div>
            <h2 className="h2">
              Hi, I'm <span className="fill">[First name]</span>.
            </h2>
            <p className="lead">
              I started Dr Plumbing &amp; Heating to give local families the
              service I would want in my own home. My family and I live in{" "}
              <span className="fill">[City]</span>, so the homes we work on
              belong to our neighbors.
            </p>
            <p className="lead">
              When you call, you get a straight answer, a fair price and a
              technician who treats your house with care.
            </p>
            <div className="signature">
              <span className="sig">[First name]</span>
              <small>Owner, Dr Plumbing &amp; Heating</small>
            </div>
            <a
              className="btn btn-outline"
              href="#about"
              style={{ alignSelf: "flex-start" }}
            >
              Read our story
            </a>
          </div>
        </div>
      </section>

      <section className="band block">
        <div className="wrap van-band">
          <div className="shots">
            <div className="ph dark big">
              <b>PHOTO: The van in a customer's driveway</b>
              <small>3/4 front angle, logo and phone number readable</small>
            </div>
            <div className="ph dark">
              <b>PHOTO: Rear doors open, shelves stocked</b>
            </div>
            <div className="ph dark">
              <b>PHOTO: Technician at a front door</b>
            </div>
          </div>
          <div className="copy">
            <div className="eyebrow">On your street</div>
            <h2 className="h2">Look for the Dr Plumbing van.</h2>
            <p className="lead">
              When our van pulls into your driveway, a licensed, insured
              technician is at your door. We explain the problem and the
              flat-rate price before any work begins.
            </p>
            <a
              className="btn btn-light"
              href="#book"
              style={{ alignSelf: "flex-start" }}
            >
              Book a visit
            </a>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="block-head">
            <div>
              <div className="eyebrow">Our work</div>
              <h2 className="h2">Recent jobs in local homes.</h2>
            </div>
            <a className="btn btn-outline" href="#work">
              See all projects
            </a>
          </div>
          <div className="gallery">
            <div className="feature">
              <div className="ph">
                <b>BEFORE</b>
                <small>Old water heater</small>
              </div>
              <div className="ph">
                <b>AFTER</b>
                <small>Same angle</small>
              </div>
              <div className="label">
                <b>Water heater replacement</b>
                <span>[City] · [Month Year]</span>
              </div>
            </div>
            <div className="ph">
              <b>PHOTO: Tankless unit on wall</b>
              <small>[Job] · [City]</small>
            </div>
            <div className="ph">
              <b>PHOTO: Finished shower valve</b>
              <small>[Job] · [City]</small>
            </div>
            <div className="ph">
              <b>PHOTO: Heat pump outdoor unit</b>
              <small>[Job] · [City]</small>
            </div>
            <div className="ph">
              <b>PHOTO: Kitchen sink and faucet</b>
              <small>[Job] · [City]</small>
            </div>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <div className="why">
            <h2 className="h2">Why homeowners call Dr Plumbing.</h2>
            <Values />
          </div>
        </div>
      </section>

      <section className="block" id="home-reviews" style={{ paddingTop: "0" }}>
        <h2 className="sr-only" tabIndex={-1}>
          Customer reviews
        </h2>
        <div className="wrap reviews">
          <figure>
            <svg
              width="48"
              height="38"
              viewBox="0 0 56 44"
              fill="var(--accent)"
              aria-hidden="true"
            >
              <path d="M0 44V26C0 11 8 2 22 0l2 6c-8 2-12 7-12 14h10v24zm32 0V26C32 11 40 2 54 0l2 6c-8 2-12 7-12 14h10v24z" />
            </svg>
            <blockquote>
              They were incredibly responsive and scheduled an appointment
              quickly… I was also pleasantly surprised by the fair pricing.
            </blockquote>
            <figcaption>
              <span className="avatar">N</span>
              <span>
                <b>Nancy</b>
                <br />
                <span className="muted">Homeowner · [City]</span>
              </span>
            </figcaption>
          </figure>
          <div className="slots">
            <div className="slot">
              <b>[Review #2 from Google or HomeAdvisor]</b>
              <span className="muted">Short quote, first name, city</span>
            </div>
            <div className="slot">
              <b>[Review #3 from Google or HomeAdvisor]</b>
              <span className="muted">Short quote, first name, city</span>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="home-area" style={{ paddingTop: "0" }}>
        <div className="wrap area">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div className="eyebrow">Service area</div>
            <h2 className="h2">Serving homes from Everett to Kent.</h2>
            <p className="lead">
              We are based in Newcastle and cover the greater Seattle area and
              the Eastside.
            </p>
            <ul className="cities">
              {CITIES.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </div>
          <div
            className="ph"
            style={{ aspectRatio: "1/1", maxHeight: "520px" }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
              <path d="M9 4v14M15 6v14" />
            </svg>
            <b>MAP: Service area, Everett to Kent</b>
            <small>Shaded map with Newcastle pinned</small>
          </div>
        </div>
      </section>

      <div className="wrap">
        <CallToAction title="Something leaking, cold or broken?" />
      </div>
    </div>
  );
}
