import { routeHref } from "./sitePaths";
import { CITIES, PLUMBING_LICENSE, SERVICE_AREA_MAP_URL, SERVICES } from "./content";
import { Arrow, CallToAction, ServiceFinder, Values } from "./SiteContent";

const COMMON_QUESTIONS = [
  ["What areas do you serve?", "Homes from Everett to Federal Way, including Seattle, Bellevue, Renton, Redmond, Sammamish, Issaquah, Bothell, Lynnwood and Shoreline. We're based in Seattle. See Areas We Serve for the full list."],
  ["Are you licensed and insured?", `Yes. We are licensed, bonded and insured in Washington (plumbing contractor license ${PLUMBING_LICENSE.number}) and HomeAdvisor certified.`],
  ["How does your pricing work?", "We charge flat rates. You approve the price before we start, and you pay no surprise fees."],
  ["Do you offer emergency service?", "Yes, for heating and cooling. If your heat or air conditioning fails, call (206) 671-8888."],
  ["Should I choose a tank or a tankless water heater?", "A tank stores hot water until you need it. A tankless unit heats water on demand, so several people can use hot water at once without waiting. We size the unit to how your household uses hot water."],
  ["Is a heat pump water heater worth it?", "It moves heat from the air into the water, so it uses far less electricity than a standard electric tank. It costs more up front, but lower bills and rebates help offset the cost."],
  ["What is hydronic heating?", "A hydronic system heats your home with hot water. A boiler heats the water, pipes carry it to radiators, baseboards or radiant floors, and a pump returns it to be heated again. The heat is even and quiet, and each zone can have its own thermostat."],
  ["How often should my boiler be serviced?", "Once a year. An annual service catches problems early and keeps your boiler safe and efficient. Call sooner if you notice uneven heat, strange noises, leaks, low pressure or rising energy bills."],
  ["When do I need hydro jetting?", "When more than one drain is clogged, sewage backs up, your main line drains slowly or your drains smell. We inspect the line first and tell you whether hydro jetting is the right fix."],
] as const;

/**
 * Description: Presents the supplied home design with its service finder and customer education.
 * Inputs: None; business details come from the site catalog and reviewed home copy.
 * Output: A homepage with service links, contact actions, and the current van artwork.
 * Examples: App.test.tsx checks the hero service link, all nine FAQs, van, and service groups.
 */
export default function HomePage() {
  return (
    <div className="view is-active" data-view="home">
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="h-text">
              <div className="eyebrow">Licensed technicians in the Greater Seattle, WA area</div>
              <h1 tabIndex={-1}>
                Plumbing, heating and cooling for homes from Everett to Federal Way.
              </h1>
              <div className="creds"><span className="yrs">26+ years in the trade</span><span>Licensed, bonded &amp; insured</span><span>Family owned in Seattle</span><span>5.0 ★ on Google</span></div>
            </div>
            <div className="h-side">
              <p className="lead">
                We fix leaks, replace water heaters and keep your heat running.
                You approve a flat-rate price before we start.
              </p>
              <div className="hero-contact">
                <div className="cta-row">
                  <a className="btn btn-primary" href={routeHref("home-services")}>
                    Find your service
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
                  </a>
                  <a className="btn btn-outline" href="tel:2066718888">
                    Call (206) 671-8888
                  </a>
                </div>
                <a className="contact-hint" href="sms:+12066718888">
                  You can <span>text us</span>, too.
                </a>
                <nav className="hero-service-nav" aria-label="Choose a service">
                  <h2>Find your service</h2>
                  <ul>
                    {SERVICES.map((service) => (
                      <li key={service.id}>
                        <a href={routeHref(service.id)}>
                          <span>{service.tab}</span>
                          <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div className="stage photo">
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
                <span>The price you approve is the price you pay.</span>
              </div>
            </div>
            <img
              className="stage-img"
              src="/van/dr-sprinter-side-v9.jpg"
              alt="Dr Plumbing, Heating and Cooling Mercedes-Benz Sprinter wrap mockup, driver side"
              width="1619"
              height="971"
            />
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
                Lic. {PLUMBING_LICENSE.number}
              </text>
              <circle cx="190" cy="346" r="46" fill="#1E2426" />
              <circle cx="190" cy="346" r="25" fill="#A7AFB2" />
              <circle cx="190" cy="346" r="8" fill="#1E2426" />
              <circle cx="800" cy="346" r="46" fill="#1E2426" />
              <circle cx="800" cy="346" r="25" fill="#A7AFB2" />
              <circle cx="800" cy="346" r="8" fill="#1E2426" />
            </svg>
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
              Flat-rate pricing
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
              Family owned in Seattle
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
              Pick a service to see what we do.
            </p>
          </div>
          <ServiceFinder />
        </div>
      </section>

      <section className="brands" aria-label="Brands we service">
        <div className="wrap">
          <p className="brands-title">Brands we service</p>
          <ul className="brand-row">
            {[
              "Rheem",
              "A. O. Smith",
              "Bradford White",
              "Navien",
              "Rinnai",
              "Carrier",
              "Trane",
              "Mitsubishi Electric",
            ].map((brand) => <li key={brand}>{brand}</li>)}
          </ul>
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
              Hi, I'm Mehran.
            </h2>
            <p className="lead">
              I started Dr Plumbing &amp; Heating to give families the service I
              want in my own home. My family lives in Seattle. The homes we work
              on belong to our neighbors.
            </p>
            <p className="lead">
              When you call, you get a straight answer, a fair price and a
              technician who treats your house with care.
            </p>
            <div className="signature">
              <span className="sig">Mehran</span>
              <small>Owner, Dr Plumbing &amp; Heating</small>
            </div>
            <a
              className="btn btn-outline"
              href={routeHref("about")}
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
            <img
              src="/van/dr-sprinter-opposite-side-v9.jpg"
              alt="Dr Plumbing, Heating and Cooling Sprinter wrap mockup, passenger side"
              width="1619"
              height="971"
              loading="lazy"
            />
            <img
              src="/van/dr-sprinter-rear-v9.jpg"
              alt="Dr Plumbing, Heating and Cooling Sprinter wrap mockup, rear doors"
              width="1620"
              height="971"
              loading="lazy"
            />
          </div>
          <div className="copy">
            <div className="eyebrow">On your street</div>
            <h2 className="h2">Look for the Dr Plumbing van.</h2>
            <p className="lead">
              Our van in your driveway means a licensed, insured technician at
              your door. We explain the problem and the price before we start.
            </p>
            <a
              className="btn btn-light"
              href={routeHref("book")}
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
            <a className="btn btn-outline" href={routeHref("work")}>
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
            <div className="why-intro">
              <div>
                <h3>Hire a professional</h3>
                <p>Doing it yourself is tempting, but a do-it-yourself drain repair can cause more damage. Our plumbers are ready to help, and we bring the same care to every job, large or small.</p>
              </div>
              <div>
                <h3>Experienced technicians</h3>
                <p>Experience matters. Cooking for a family of four or managing a staff of twenty gets easier with practice, and so does work on a home. A technician must know a wide range of products, materials and equipment, and have the skill to use them. We hire only experienced technicians.</p>
              </div>
            </div>
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
              Honestly, I’ve never seen such dedication and service. They fixed
              every problem we had.
            </blockquote>
            <figcaption>
              <span className="avatar" aria-hidden="true">G</span>
              <span>
                <b>Google review</b>
                <br />
                <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
              </span>
            </figcaption>
          </figure>
          <div className="slots">
            <div className="rev-card">
              <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
              <blockquote>
                Mohammed is awesome, fast and professional. Very on top of his craft.
              </blockquote>
              <span className="muted">Google review</span>
            </div>
            <div className="rev-rating">
              <b>5.0 ★</b>
              <span className="muted">Rating on Google</span>
              <a className="link-arrow" href="https://share.google/1MNxAAukRtLZXNZlW" target="_blank" rel="noopener noreferrer">
                Read all reviews on Google
              </a>
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
            <h2 className="h2">We serve homes from Everett to Federal Way.</h2>
            <p className="lead">
              We're based in Seattle and serve the greater Seattle area and the
              Eastside.
            </p>
            <ul className="cities">
              {CITIES.map((city) => <li key={city}>{city}</li>)}
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
      </section>

      <section className="block" id="home-faq" style={{ paddingTop: "0" }}>
        <div className="wrap faq">
          <div className="f-head">
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Common questions.</h2>
            <p className="lead">
              Don't see your question?
              <a className="faq-phone" href="tel:2066718888">Call <b>(206) 671-8888</b>.</a>
            </p>
          </div>
          <div className="f-list">
            {COMMON_QUESTIONS.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <CallToAction title="Something leaking, cold or broken?" />
      </div>
    </div>
  );
}
