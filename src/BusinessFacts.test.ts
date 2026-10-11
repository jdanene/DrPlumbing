import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BUSINESS,
  WEEKDAYS,
  confirmed,
  confirmedFact,
  displayText,
  formatHours,
  pendingFact,
  pendingPlaceholders,
} from "./businessFacts";
import { BUSINESS_NAME, CITIES, PLUMBING_LICENSE } from "./content";
import { PUBLIC_ROUTES, headTags } from "./seo";
import { pathSlug, routeHref } from "./sitePaths";
import { serviceDetailSlug } from "./serviceDetails";

afterEach(() => vi.unstubAllEnvs());

/** A bracketed capitalized label such as [HOURS]; JSON arrays also use brackets, so the test looks for the label shape. */
const PLACEHOLDER = /\[[A-Z][A-Z ]*\]/;

describe("the business record", () => {
  it("gives prose a confirmed value as written", () => {
    expect(displayText(BUSINESS.phone, (phone) => phone.display)).toBe("(206) 671-8888");
    expect(confirmed(BUSINESS.email)).toBe("drplumbinggroup@gmail.com");
    expect(confirmedFact("Newcastle", "Owner", "2026-10-04").value).toBe("Newcastle");
  });

  it("shows a pending fact's placeholder outside production and nothing in production", () => {
    expect(confirmed(BUSINESS.hours)).toBeUndefined();
    expect(displayText(BUSINESS.hours, formatHours)).toBe("[HOURS]");
    vi.stubEnv("PROD", true);
    expect(displayText(BUSINESS.hours, formatHours)).toBeUndefined();
  });

  it("never emits a candidate value, even though it records one", () => {
    expect(BUSINESS.hours.candidate).toEqual([{ days: WEEKDAYS, opens: "08:00", closes: "20:00" }]);
    expect(confirmed(pendingFact("[X]", "", 1))).toBeUndefined();
    for (const route of PUBLIC_ROUTES) {
      const head = headTags(route).map((tag) => `${JSON.stringify(tag.attributes)}${tag.text ?? ""}`).join("\n");
      expect(head).not.toContain("openingHoursSpecification");
      expect(head).not.toMatch(PLACEHOLDER);
    }
  });

  it("lists exactly the facts still waiting on the owner", () => {
    expect(pendingPlaceholders()).toEqual(["[HOURS]", "[SOCIAL PROFILES]", "[PRICE RANGE]", "[RESPONSE TIME]"]);
  });

  it("serves one city list that includes the home base and repeats nothing", () => {
    const cities = confirmed(BUSINESS.serviceCities);
    expect(cities).toContain("Newcastle");
    expect(new Set(cities).size).toBe(cities.length);
    expect(cities).toHaveLength(28);
    expect(CITIES).toBe(cities);
    expect(BUSINESS_NAME).toBe("Dr Plumbing & Heating Grp LLC");
    expect(PLUMBING_LICENSE.number).toBe("DRPLUPH740ND");
  });
});

describe("hours as a customer reads them", () => {
  it("reads daily for seven days and names a run of days otherwise", () => {
    expect(formatHours([{ days: WEEKDAYS, opens: "08:00", closes: "20:00" }])).toBe("8 AM to 8 PM daily");
    expect(formatHours([
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
      { days: ["Saturday"], opens: "09:00", closes: "13:30" },
    ])).toBe("8 AM to 6 PM Monday to Friday, 9 AM to 1:30 PM Saturday");
    expect(formatHours([{ days: ["Monday", "Wednesday"], opens: "12:00", closes: "00:00" }])).toBe("12 PM to 12 AM Monday, Wednesday");
    expect(formatHours([])).toBe("");
  });
});

describe("one address rule", () => {
  it.each([
    ["Gas water heaters", "gas-water-heaters"],
    ["Faucets, fixtures & sinks", "faucets-fixtures-and-sinks"],
    ["East Hill-Meridian", "east-hill-meridian"],
    ["SeaTac", "seatac"],
    ["", ""],
  ])("slugs %j as %j", (label, slug) => {
    expect(pathSlug(label)).toBe(slug);
    expect(serviceDetailSlug(label)).toBe(slug);
  });

  it("joins every child segment after the page", () => {
    expect(routeHref("areas/bellevue/water-heaters")).toBe("/areas-we-serve/bellevue/water-heaters/");
    expect(routeHref("drain-sewer/hydrojetting")).toBe("/drain-and-sewer/hydrojetting/");
    expect(routeHref("home")).toBe("/");
    expect(routeHref("nowhere/x")).toBe("/");
  });
});
