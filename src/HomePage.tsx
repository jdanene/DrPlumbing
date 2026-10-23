import { routeHref } from "./sitePaths";
import { PLUMBING_LICENSE, SERVICES } from "./content";
import { CITY_PAGES } from "./cities";
import { Arrow } from "./SiteContent";
import { PHOTOS } from "./projectPhotos";
import ProjectPhoto from "./ProjectPhoto";
import BathroomRemodeling from "./BathroomRemodeling";

const QUESTIONS = [
  ["How does your pricing work?", "We charge flat rates. You approve the price before we start, and you pay no surprise fees."],
  ["Do you offer emergency service?", "Yes, day or night, for plumbing and hydronic heating. Call (206) 671-8888. The Emergency plumber page under General plumbing says what to do while you wait."],
  ["Are you licensed and insured?", `Yes. We are licensed, bonded and insured in Washington. Our plumbing contractor license is ${PLUMBING_LICENSE.number}.`],
  ["What areas do you serve?", "Homes across the Greater Seattle area, from Everett to Federal Way, including the Eastside. See our service area page for the full list."],
  ["Should I choose a tank or tankless water heater?", "A tank stores hot water. A tankless unit heats water on demand and takes less space. We size the unit to how your household uses hot water."],
  ["What is hydronic heating?", "A hydronic system heats your home with hot water. A boiler heats the water, pipes carry it to radiators, baseboards or radiant floors, and a pump returns it to be heated again."],
  ["How often should my boiler be serviced?", "Once a year. Annual service catches problems early. Call sooner if you notice uneven heat, strange noises, leaks, low pressure or rising energy bills."],
  ["Is a heat pump water heater worth it?", "It moves heat from the air into the water, so it uses less electricity than a standard electric tank. We can help you compare the upfront cost and running costs for your home."],
  ["When do I need hydrojetting?", "When several drains clog, your main line drains slowly, or sewage backs up. We inspect the line first and tell you whether hydrojetting is the right fix."],
] as const;

/**
 * Description: Leads homeowners from real workmanship to the relevant service.
 * Inputs: None. Service destinations and photos come from the approved catalogs.
 * Output: A photo-led homepage with direct service links, project proof, and contact routes.
 * Examples: HomePage.test.tsx verifies six service destinations, FAQ disclosure, and booking.
 */
export default function HomePage() {
  return (
    <div className="view is-active home-redesign" data-view="home">
      <section className="home-opening" aria-labelledby="home-title">
        <div className="opening-photo">
          <ProjectPhoto photo={PHOTOS.copperPressDetail} priority />
          <div className="opening-shade" />
          <div className="opening-copy">
            <h1 id="home-title" tabIndex={-1}>Your local <br />plumbing &amp;<br /><span>heating team.</span></h1>
            <p>Family owned. Serving Greater Seattle.<br />26+ years in the trade.</p>
            <p className="opening-emergency">Plumbing emergency? <a href="tel:2066718888">Call (206) 671-8888</a>, day or night. <a href={routeHref("plumbing/emergency-plumber")}>What to do first</a>.</p>
            <a className="btn btn-primary opening-book" href={routeHref("book")}>Book a visit <Arrow /></a>
          </div>
          <span className="opening-caption">Copper connections · Hydronic heating work</span>
        </div>
        <div className="service-index" id="home-services">
          <div className="service-index-heading"><h2>How can we help?</h2><a href={routeHref("services")}>All services <Arrow /></a></div>
          <nav className="service-index-links" aria-label="Choose a service">
            {SERVICES.map(service => <a key={service.id} href={routeHref(service.id)}><span>{service.tab}</span><Arrow /></a>)}
          </nav>
        </div>
      </section>

      <section className="home-promise wrap" aria-label="What to expect">
        <p>Good work starts with<br /><strong>a straight answer.</strong></p>
        <div><h2>A price before we start.</h2><p>You approve a flat-rate price before the work begins. No surprise fees.</p></div>
        <div><h2>A qualified team in your home.</h2><p>Licensed, bonded and insured. The same care for a small repair or a new installation.</p></div>
      </section>

      <section className="home-work wrap" aria-labelledby="work-title">
        <div className="home-section-heading"><h2 id="work-title">The work.<br /><span>The difference.</span></h2><div><p>From the fittings you see to the pipework behind the wall. Take a closer look at our projects.</p><a className="text-link" href={routeHref("work")}>Explore our work <Arrow /></a></div></div>
        <div className="featured-projects">
          <a className="featured-project bathroom-project" href={routeHref("plumbing/complete-bathroom-remodeling")}>
            <ProjectPhoto photo={PHOTOS.remodeledBathroom} fullFrame />
            <div className="project-caption"><div><h3>Bathrooms, made for everyday life.</h3><p>Showers, tubs &amp; fixtures</p></div><span className="round-arrow"><Arrow /></span></div>
          </a>
          <a className="featured-project hot-water-project" href={routeHref("water-heaters")}>
            <ProjectPhoto photo={PHOTOS.twinNavien} fullFrame />
            <div className="project-caption"><div><h3>Hot water. Thoughtfully installed.</h3><p>Tank &amp; tankless water heaters</p></div><span className="round-arrow"><Arrow /></span></div>
          </a>
        </div>
        <div className="project-secondary">
          <a href={routeHref("water-filtration")}><ProjectPhoto photo={PHOTOS.filters} /><div><h3>Whole-house water filtration</h3><Arrow /></div></a>
          <a href={routeHref("plumbing/trenchless-water-line-repair")}><ProjectPhoto photo={PHOTOS.drillingRig} /><div><h3>Trenchless water lines</h3><Arrow /></div></a>
          <a href={routeHref("drain-sewer")}><ProjectPhoto photo={PHOTOS.sewer} /><div><h3>Drain &amp; sewer repair</h3><Arrow /></div></a>
        </div>
      </section>

      <BathroomRemodeling />

      <section className="home-heating" aria-labelledby="heating-title">
        <div className="wrap heating-layout">
          <div className="heating-copy"><h2 id="heating-title">Comfort is in<br />the details.</h2><p>Boilers. Hydronic heating. The pipes, pumps and controls that work together to keep your home warm.</p><p>We install, repair and service these systems, from the boiler to the rooms it heats.</p><a className="btn btn-light" href={routeHref("boilers")}>Explore boilers &amp; hydronic heating <Arrow /></a><a className="heating-other" href={routeHref("heating-cooling")}>Looking for heating &amp; cooling? <Arrow /></a></div>
          <figure className="heating-photo"><ProjectPhoto photo={PHOTOS.boilerWork} fullFrame /><figcaption>Working on a hydronic heating system.</figcaption></figure>
        </div>
      </section>

      <section className="home-owner wrap" aria-labelledby="owner-title">
        <div className="owner-statement"><h2 id="owner-title">A family business.<br />A personal standard.</h2><blockquote>“If I would not do it in my own house, I will not recommend it for yours.”</blockquote><p><strong>Mehran</strong> · Owner, Dr Plumbing &amp; Heating</p><a className="text-link" href={routeHref("about")}>Meet the team <Arrow /></a></div>
        <figure className="owner-van"><img src="/van/dr-sprinter-side-v9.jpg" alt="Dr Plumbing & Heating residential plumbing and heating service van design" width="1619" height="971" loading="lazy" /><figcaption>Family owned. Here for Greater Seattle homes.</figcaption></figure>
      </section>

      <section className="home-review" id="home-reviews" aria-labelledby="review-title"><div className="wrap review-layout"><div><h2 id="review-title">What our<br />customers say.</h2><a className="text-link" href="https://share.google/1MNxAAukRtLZXNZlW" target="_blank" rel="noreferrer">Read Google reviews <Arrow /></a></div><figure><blockquote>“Honestly, I’ve never seen such dedication and service. They fixed every problem we had.”</blockquote><figcaption>Google review · 5 out of 5 stars</figcaption></figure></div></section>

      <section className="home-questions wrap" id="home-faq" aria-labelledby="faq-title">
        <div><h2 id="faq-title">A few things<br />worth knowing.</h2><p>Clear answers before you book.</p></div>
        <div className="home-question-list">{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<span className="disclosure-mark" aria-hidden="true" /></summary><div className="answer"><p>{answer}</p></div></details>)}</div>
      </section>

      <section className="home-area" id="home-area"><div className="wrap area-layout"><div><h2>Greater Seattle.<br />Your neighborhood.</h2><p>From Everett to Federal Way, including the Eastside.</p><a className="text-link" href={routeHref("areas")}>See our service area <Arrow /></a></div><ul>{CITY_PAGES.map(city => <li key={city.slug}><a href={routeHref(`areas/${city.slug}`)}>{city.name}</a></li>)}</ul></div></section>

      <section className="home-close wrap">
        <div>
          <h2>Let’s take care of it.</h2>
          <p>Tell us what your home needs. We’ll confirm the next step.</p>
          <p className="home-close-contact">
            <a href="tel:2066718888" aria-label="Call (206) 671-8888">Call</a>{" or "}
            <a href="sms:+12066718888" aria-label="Text (206) 671-8888">text</a>{" "}
            <span>(206) 671-8888</span>
          </p>
        </div>
        <a className="btn btn-primary" href={routeHref("book")}>Book a visit <Arrow /></a>
      </section>
    </div>
  );
}
