/**
 * Description: The approved record of the business. Every public fact lives here once, with its
 * source, so pages, metadata and forms agree and an unconfirmed fact can never reach production
 * as a guess. The module holds facts and the one rule for pending ones; it holds no React, no
 * schema.org shaping (seo.ts) and no page copy.
 * Inputs: None. Values come from the owner, Washington L&I, or the business's own Google profile;
 * each confirmed fact names its source and date.
 * Output: BUSINESS, the typed record, plus the accessors confirmed() and displayText() and the
 * hours formatter.
 * Examples: BusinessFacts.test.ts runs every example in the headers below.
 */

/** A fact the owner or an official record has confirmed, with where and when. */
export interface ConfirmedFact<T> {
  status: "confirmed";
  value: T;
  source: string;
  confirmedOn: string;
}

/**
 * A fact still waiting on the owner. The placeholder is what development and tests show; the
 * candidate records what public listings say so the conversation with the owner is documented,
 * and it is never emitted.
 */
export interface PendingFact<T> {
  status: "pending";
  placeholder: `[${string}]`;
  candidate?: T;
  note?: string;
}

export type Fact<T> = ConfirmedFact<T> | PendingFact<T>;

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const WEEKDAYS: readonly Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Opening hours for a set of days; times are 24-hour "HH:MM". */
export interface OpeningHours {
  days: readonly Weekday[];
  opens: string;
  closes: string;
}

/** One phone number in the form people read and the form links and schema need. */
export interface Phone {
  display: string;
  e164: string;
}

export interface SocialProfile {
  label: string;
  url: string;
}

export interface License {
  number: string;
  registeredName: string;
  url: string;
}

/**
 * Description: Records a fact an authority has confirmed.
 * Inputs: value is the fact; source names who or what confirmed it; confirmedOn is an ISO date.
 * Output: A confirmed fact.
 * Examples: confirmedFact("Newcastle", "Owner", "2026-10-04").value is "Newcastle".
 */
export function confirmedFact<T>(value: T, source: string, confirmedOn: string): ConfirmedFact<T> {
  return { status: "confirmed", value, source, confirmedOn };
}

/**
 * Description: Records a fact the owner has not confirmed yet, without guessing it.
 * Inputs: placeholder is the bracketed label shown outside production; note says what is known
 * and from where; candidate is the value public listings show, kept for the owner conversation.
 * Output: A pending fact.
 * Examples: pendingFact("[HOURS]").placeholder is "[HOURS]"; confirmed(pendingFact("[X]", "", 1)) is undefined.
 */
export function pendingFact<T>(placeholder: `[${string}]`, note?: string, candidate?: T): PendingFact<T> {
  return { status: "pending", placeholder, note, candidate };
}

/**
 * Description: The approved value for machine readers: structured data, form options, the sitemap.
 * Inputs: fact is any entry of BUSINESS.
 * Output: The confirmed value. A pending fact yields undefined in every mode; its candidate is
 * never returned, so an unconfirmed value cannot reach a search engine.
 * Examples: confirmed(BUSINESS.email) is "drplumbinggroup@gmail.com"; confirmed(BUSINESS.hours) is undefined.
 */
export function confirmed<T>(fact: ConfirmedFact<T>): T;
export function confirmed<T>(fact: Fact<T>): T | undefined;
export function confirmed<T>(fact: Fact<T>): T | undefined {
  return fact.status === "confirmed" ? fact.value : undefined;
}

/**
 * Description: The text a page shows for a fact. In development and tests a pending fact shows its
 * bracketed placeholder so the gap is visible; in production it shows nothing.
 * Inputs: fact is any entry of BUSINESS; format turns a confirmed value into prose and defaults to
 * String().
 * Output: The formatted value, the placeholder, or undefined in a production build.
 * Examples: displayText(BUSINESS.phone, (p) => p.display) is "(206) 671-8888";
 * displayText(BUSINESS.hours, formatHours) is "[HOURS]" under vitest and undefined when PROD is stubbed true.
 */
export function displayText<T>(fact: Fact<T>, format: (value: T) => string = String): string | undefined {
  if (fact.status === "confirmed") return format(fact.value);
  return import.meta.env.PROD ? undefined : fact.placeholder;
}

/**
 * Description: Writes opening hours the way a customer reads them.
 * Inputs: hours is one or more entries; a single entry covering all seven days reads as "daily".
 * Output: One clause per entry joined with ", ", such as "8 AM to 8 PM daily" or
 * "8 AM to 6 PM Monday to Friday, 9 AM to 1 PM Saturday".
 * Examples: formatHours([{ days: WEEKDAYS, opens: "08:00", closes: "20:00" }]) is "8 AM to 8 PM daily";
 * formatHours([]) is "".
 */
export function formatHours(hours: readonly OpeningHours[]): string {
  return hours.map((entry) => `${clockText(entry.opens)} to ${clockText(entry.closes)} ${daysText(entry.days)}`).join(", ");
}

/** "08:00" → "8 AM"; "13:30" → "1:30 PM". */
function clockText(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const twelveHour = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return minute ? `${twelveHour}:${String(minute).padStart(2, "0")} ${suffix}` : `${twelveHour} ${suffix}`;
}

/** Seven days read "daily"; a consecutive run reads "Monday to Friday"; anything else lists the days. */
function daysText(days: readonly Weekday[]) {
  if (days.length === 7) return "daily";
  const positions = days.map((day) => WEEKDAYS.indexOf(day));
  const consecutive = positions.every((position, index) => index === 0 || position === positions[index - 1]! + 1);
  if (consecutive && days.length > 1) return `${days[0]} to ${days[days.length - 1]}`;
  return days.join(", ");
}

const OWNER_PROFILE = "Google Business Profile areas served, read 2026-10-04";

/**
 * The record itself. Pending entries are the owner checklist: BusinessFacts.test.ts pins their
 * placeholders, so confirming one is a reviewed change here and there.
 */
export const BUSINESS = {
  publicName: confirmedFact("Dr Plumbing & Heating", "Brand decision recorded in PROJECT_CONTEXT.md", "2026-09-27"),
  legalName: confirmedFact("Dr Plumbing & Heating Group LLC", "Owner-approved name on the production website", "2026-10-14"),
  phone: confirmedFact<Phone>({ display: "(206) 671-8888", e164: "+12066718888" }, "Owner; shown on the live site and Google profile", "2026-10-04"),
  email: confirmedFact("drplumbinggroup@gmail.com", "Owner; shown on the live site", "2026-10-04"),
  license: confirmedFact<License>(
    {
      number: "DRPLUPH740ND",
      registeredName: "Dr Plumbing & Heating Grp LLC",
      url: "https://secure.lni.wa.gov/verify/Detail.aspx?UBI=604661707&LIC=DRPLUPH740ND&SAW=",
    },
    "Washington L&I contractor record; active status confirmed by Jide in JDA-408 on 2026-10-20",
    "2026-10-20",
  ),
  ownerExperience: confirmedFact({ name: "Mehran", years: "26+" }, "Jide, JDA-408: Mehran has personally been plumbing for 26+ years", "2026-10-20"),
  ownerOnJob: confirmedFact("Owners on the job", "Jide, JDA-408", "2026-10-20"),
  serviceScope: confirmedFact("water heaters, boilers and radiant heat, drains and sewer lines, trenchless repair, gas lines and complete bathroom remodels", "Jide, JDA-408", "2026-10-20"),
  workStandard: confirmedFact("Quality workmanship", "Jide, JDA-408", "2026-10-20"),
  googleReputation: confirmedFact({ reviews: 6, rating: 5 }, "Google Business Profile, read 2026-10-20; October 19 MapPack scans", "2026-10-20"),
  homeBase: confirmedFact<{ city: string; region: "WA" }>({ city: "Newcastle", region: "WA" }, "Owner; the live site's About page", "2026-10-04"),
  priceBasis: confirmedFact("You approve a flat-rate price before work starts.", "Approved mockup copy; reaffirmed by Jide in JDA-408", "2026-10-20"),
  serviceCities: confirmedFact<readonly string[]>(
    [
      "Auburn",
      "Bellevue",
      "Bothell",
      "Burien",
      "Cottage Lake",
      "Des Moines",
      "East Hill-Meridian",
      "Edmonds",
      "Everett",
      "Federal Way",
      "Issaquah",
      "Kent",
      "Kirkland",
      "Lake Stevens",
      "Lynnwood",
      "Machias",
      "Maltby",
      "Mill Creek",
      "Mercer Island",
      "Mountlake Terrace",
      "Mukilteo",
      "Newcastle",
      "Redmond",
      "Renton",
      "Sammamish",
      "SeaTac",
      "Seattle",
      "Shoreline",
      "Skyway",
      "Snohomish",
    ],
    `The approved website list plus Newcastle, the home base (${OWNER_PROFILE}); Mercer Island added at Jide's request on 2026-10-14; Kirkland added at Jide's request on 2026-10-18`,
    "2026-10-18",
  ),
  hours: pendingFact<readonly OpeningHours[]>(
    "[HOURS]",
    "Google and Yelp show 8 AM to 8 PM every day, read 2026-10-10; the owner has not confirmed it for the site",
    [{ days: WEEKDAYS, opens: "08:00", closes: "20:00" }],
  ),
  socialProfiles: pendingFact<readonly SocialProfile[]>("[SOCIAL PROFILES]", "No profiles exist yet under the current name, checked 2026-10-10"),
  priceRange: pendingFact<string>("[PRICE RANGE]", "schema.org wants a short marker such as $$; the owner has not set one"),
  responseTime: pendingFact<string>("[RESPONSE TIME]", "A time the owner will stand behind; none confirmed"),
};

/**
 * Description: Lists the facts still waiting on the owner, for tests and for the review checklist.
 * Inputs: None.
 * Output: The placeholders of every pending entry in BUSINESS, in declaration order.
 * Examples: pendingPlaceholders() is ["[HOURS]", "[SOCIAL PROFILES]", "[PRICE RANGE]", "[RESPONSE TIME]"] today.
 */
export function pendingPlaceholders(): string[] {
  const facts: Fact<unknown>[] = Object.values(BUSINESS);
  return facts.flatMap((fact) => (fact.status === "pending" ? [fact.placeholder] : []));
}
