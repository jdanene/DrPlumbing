import { describe, expect, it, vi } from "vitest";
import { graphNode } from "./seoTestSupport";

/** The record as it will read once the owner confirms hours, a profile and a price range. */
vi.mock("./businessFacts", async (importOriginal) => {
  const facts = await importOriginal<typeof import("./businessFacts")>();
  return {
    ...facts,
    BUSINESS: {
      ...facts.BUSINESS,
      hours: facts.confirmedFact([{ days: facts.WEEKDAYS, opens: "08:00", closes: "20:00" }], "Owner", "2026-10-11"),
      socialProfiles: facts.confirmedFact([{ label: "Facebook", url: "https://www.facebook.com/drplumbingheating" }], "Owner", "2026-10-11"),
      priceRange: facts.confirmedFact("$$", "Owner", "2026-10-11"),
    },
  };
});

describe("the business node once the owner confirms the pending facts", () => {
  it("adds hours, profiles and a price range in schema.org shape", () => {
    const business = graphNode("home", "#business");
    expect(business.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "20:00",
      },
    ]);
    expect(business.sameAs).toEqual(["https://www.facebook.com/drplumbingheating"]);
    expect(business.priceRange).toBe("$$");
  });
});
