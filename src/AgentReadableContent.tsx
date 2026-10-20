import { BUSINESS, confirmed, formatHours } from "./businessFacts";
import { type CityPageMatch } from "./cities";
import { routeHref } from "./sitePaths";
import { PAGE_DATES } from "./pageDates";
import { SERVICE_ANSWERS } from "./content/serviceAnswers";
import snapshot from "./content/rivals.json";
import { CUSTOMER_REVIEWS, REVIEW_SOURCE } from "./content/customerReviews";
import BusinessDefinition from "./BusinessDefinition";
import { answerKey, factMonth, fillCity, isAgentReadable, pageTier, rivalSiteFact, scanSentence, scanServiceFor, type RivalScan } from "./agentReadable";
import "./agentReadable.css";

const scans = snapshot.scans as RivalScan[];
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * Description: Requires the saved city-and-service observation before rendering a comparison.
 * Inputs: A resolved target-city page; no scan or paid request runs during rendering.
 * Output: The existing scan. Missing evidence throws with a route instead of publishing guessed numbers.
 * Examples: A Bellevue boiler page selects Bellevue/boilers-and-radiant; a trenchless water-line page selects its trenchless scan.
 */
function scanFor(page: CityPageMatch) {
  const service = scanServiceFor(page.service?.id, page.detail?.item);
  const scan = scans.find((item) => item.citySlug === page.city.slug && item.serviceId === service);
  if (!scan) throw new Error(`${page.route}: missing saved ${service} comparison`);
  return scan;
}

/**
 * Description: Places the homeowner question and short answer immediately beneath the page title.
 * Inputs: A resolved city page; non-cohort city pages render nothing and retain existing copy.
 * Output: Recorded dates, the first H2, sourced guidance, a unique measured sentence and comparison link.
 * Examples: A Bellevue water-heater page asks about repair or replacement and links its own service comparison.
 */
export function AgentReadableAnswer({ page }: { page: CityPageMatch }) {
  if (!isAgentReadable(page)) return null;
  const key = answerKey(page);
  const answer = SERVICE_ANSWERS[key];
  if (!answer) throw new Error(`${page.route}: missing answer ${key}`);
  const tier = pageTier(page.service?.id, page.detail?.item);
  const scan = scanFor(page);
  const dates = PAGE_DATES[page.route];
  const subject = page.detail?.item ?? page.service?.tab ?? "Plumbing services";
  const comparison = tier === "A" ? "#service-comparison" : `${routeHref(`areas/${page.city.slug}`)}#service-comparison`;
  return <div className="reading-answer" data-answer-key={key} data-reading-tier={tier}>
    <p className="page-dates">
      {dates.published && <>Published <time dateTime={dates.published}>{dateFormat.format(new Date(`${dates.published}T00:00:00Z`))}</time>. </>}
      Updated <time dateTime={dates.updated}>{dateFormat.format(new Date(`${dates.updated}T00:00:00Z`))}</time>.
    </p>
    <h2>{fillCity(answer.question, page.city.name)}</h2>
    <p className="reading-short-answer">{fillCity(answer.answer, page.city.name)}</p>
    <p className="reading-scan-sentence">{scanSentence(subject, page.city.name, scan, tier)}</p>
    <p><a href={comparison}>{tier === "A" ? `Compare providers for ${subject.toLowerCase()} in ${page.city.name}` : `Compare plumbers serving ${page.city.name}`}</a></p>
    <BusinessDefinition />
    {answer.sources.length > 0 && <details className="reading-sources"><summary>Sources for this guidance</summary><ul>{answer.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></details>}
  </div>;
}

/**
 * Description: Renders dated first-party facts and the right comparison tier without inventing rival claims.
 * Inputs: A resolved target city page and the committed MapPack export.
 * Output: Tier A's named comparison or Tier B's hub link, with text reviews on hubs only.
 * Examples: Every hub shows six Google review records; filtration pages name no competing stores.
 */
export function AgentReadableEvidence({ page }: { page: CityPageMatch }) {
  if (!isAgentReadable(page)) return null;
  const scan = scanFor(page);
  const tier = pageTier(page.service?.id, page.detail?.item);
  const reputation = confirmed(BUSINESS.googleReputation);
  const owner = confirmed(BUSINESS.ownerExperience);
  return <div className="reading-evidence">
    <section className="other reading-business-facts">
      <h2>What you can expect from Dr Plumbing &amp; Heating</h2>
      <ul>
        <li>{confirmed(BUSINESS.ownerOnJob)}. As of {factMonth(BUSINESS.ownerOnJob.confirmedOn)}.</li>
        <li>{owner.years} years of plumbing experience for {owner.name}. As of {factMonth(BUSINESS.ownerExperience.confirmedOn)}.</li>
        <li>{confirmed(BUSINESS.workStandard)} across {confirmed(BUSINESS.serviceScope).summary}. As of {factMonth(BUSINESS.serviceScope.confirmedOn)}.</li>
        <li>Serving {page.city.name} as part of our Greater Seattle service area. As of {factMonth(BUSINESS.serviceCities.confirmedOn)}.</li>
        <li>{confirmed(BUSINESS.priceBasis)} As of {factMonth(BUSINESS.priceBasis.confirmedOn)}.</li>
        <li>Hours: {formatHours(confirmed(BUSINESS.hours))}, Pacific time. As of {factMonth(BUSINESS.hours.confirmedOn)}. <a href={REVIEW_SOURCE}>Google profile</a>.</li>
      </ul>
      <p>Call or text to confirm appointment availability.</p>
    </section>
    {tier === "A" ? <section className="other reading-comparison" id="service-comparison">
      <h2>Dr Plumbing &amp; Heating and other providers for {page.service?.tab.toLowerCase() ?? "plumbing"} in {page.city.name}</h2>
      <p>Google Maps observations from {scan.scannedAt.slice(0, 10)}, across {scan.searches} usable searches. The measured leading group contains {scan.top} businesses. This is a dated comparison, not a promise of availability or a complete list of companies.</p>
      <div className="reading-table-scroll" role="region" aria-label={`${page.city.name} service comparison`} tabIndex={0}>
        <table>
          <caption>Ratings, reviews and Google listing categories at the scan date. Search share means positions 1–3, not the size of the leading group.</caption>
          <thead><tr>
            <th scope="col">Company</th>
            <th scope="col">Rating / reviews</th>
            <th scope="col">Search share</th>
            <th scope="col">First place</th>
            <th scope="col">Listed categories and checked services</th>
          </tr></thead>
          <tbody>
            <tr>
              <th scope="row">Dr Plumbing &amp; Heating</th>
              <td>{scan.own.rating === null ? "Not observed in this scan" : `${scan.own.rating.toFixed(1)} / ${scan.own.reviews}`}</td>
              <td>{scan.own.share === null ? "Not reported" : `${Math.round(scan.own.share)}%`}. Seen in {scan.own.seen} of {scan.searches}; positions 1–{scan.top} in {scan.own.inTop} searches</td>
              <td>{scan.own.firstPlaceCount ?? "Not reported"}</td>
              <td>{scan.own.categories.length ? `${scan.own.categories.join(", ")}. ` : ""}We offer {confirmed(BUSINESS.serviceScope).summary}. <a href={REVIEW_SOURCE}>Google profile</a></td>
            </tr>
            {scan.rivals.map((rival) => {
              const checked = rivalSiteFact(rival.website);
              return <tr key={`${rival.name}-${rival.website}`}>
                <th scope="row">{rival.name}</th>
                <td>{rival.rating === null ? "Not reported" : rival.rating.toFixed(1)} / {rival.reviews ?? "Not reported"}</td>
                <td>{rival.share === null ? "Not reported" : `${Math.round(rival.share)}%`}</td>
                <td>{rival.firstPlaceCount ?? "Not reported"}</td>
                <td>
                  {rival.categories.join(", ")}
                  {checked && <p>{checked.fact} <a href={checked.source}>Source</a> (checked {checked.checkedOn}).</p>}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <p>Our current Google profile has {reputation.rating.toFixed(1)} stars from {reputation.reviews} reviews, read on {BUSINESS.googleReputation.confirmedOn}. A saved scan can show an older total or no observed listing.</p>
      <p>Google categories are labels, not a complete service list. A missing boiler or trenchless category does not establish that a company does not offer that work. Confirm the specific service directly.</p>
      <h3>When another provider may fit</h3>
      {scan.rivals.filter((rival) => rivalSiteFact(rival.website)).map((rival) => {
        const fact = rivalSiteFact(rival.website)!;
        return <p key={rival.name}>{fact.whenToConsider} <a href={fact.source}>Read its stated services</a>.</p>;
      })}
      <p>Choose the company that confirms the service, timing and installation scope you need. Compare written estimates rather than ratings alone. For owner-involved plumbing, boiler, radiant or remodeling work, call us to discuss the job and approve the price before work starts.</p>
      <details><summary>How this comparison was measured</summary><p>MapPack used saved Google Maps results for three service phrases at 30 fixed points, zoom 13z. The leading-group size follows the measured top used in this scan; search share always counts positions 1–3. Repeated results from a single company are combined by its Google identity. Ratings and review counts are the saved observation, not live totals.</p></details>
    </section> : <section className="other"><h2>Compare local plumbing choices</h2><p><a href={`${routeHref(`areas/${page.city.slug}`)}#service-comparison`}>Read the {page.city.name} plumbing comparison</a> before choosing a provider. For this service, confirm equipment, access and the work included in the estimate.</p></section>}
    {!page.service && <section className="other reading-reviews" id="customer-reviews">
      <h2>Customer reviews on Google</h2>
      <p>{reputation.rating.toFixed(1)} out of 5 from {reputation.reviews} reviews, as of {factMonth(BUSINESS.googleReputation.confirmedOn)}. <a href={REVIEW_SOURCE}>Read the Google reviews</a>.</p>
      {CUSTOMER_REVIEWS.map((review) => <figure key={review.name}>
        {"quote" in review ? <blockquote>{review.quote}{review.excerpt ? " …" : ""}</blockquote> : <p>{review.tags}</p>}
        <figcaption>{review.name} · Google · {review.rating} out of 5{"quote" in review ? review.excerpt ? " · excerpt" : "" : " · rating and service tags; no written review"}</figcaption>
      </figure>)}
    </section>}
  </div>;
}
