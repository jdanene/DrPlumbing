import { describe, expect, it } from "vitest";
import { PUBLIC_ROUTES, headTags } from "./seo";
import { graphNode } from "./seoTestSupport";

/** A bracketed capitalized label such as [HOURS]; JSON arrays also use brackets, so the test looks for the label shape. */
const PLACEHOLDER = /\[[A-Z][A-Z ]*\]/;

describe("the business node", () => {
  it("carries every confirmed fact and no pending one", () => {
    const business = graphNode("home", "#business");
    expect(business["@type"]).toEqual(["Plumber", "HVACBusiness"]);
    expect(() => graphNode("home", "#service")).toThrow("home has no #service node");
    expect(business.name).toBe("Dr Plumbing & Heating");
    expect(business.legalName).toBe("Dr Plumbing & Heating Grp LLC");
    expect(business.telephone).toBe("+12066718888");
    expect(business.email).toBe("drplumbinggroup@gmail.com");
    const cities = business.areaServed as { "@type": string; name: string }[];
    expect(cities).toHaveLength(28);
    expect(cities).toContainEqual({ "@type": "City", name: "Newcastle" });
    expect(business).not.toHaveProperty("openingHoursSpecification");
    expect(business).not.toHaveProperty("sameAs");
    expect(business).not.toHaveProperty("priceRange");
  });

  it("names the website and the social card after the public name", () => {
    expect(graphNode("home", "#website").name).toBe("Dr Plumbing & Heating");
    const siteName = headTags("home").find((tag) => tag.attributes.property === "og:site_name");
    expect(siteName?.attributes.content).toBe("Dr Plumbing & Heating");
  });

  it("shows no placeholder on any public route", () => {
    expect(PUBLIC_ROUTES.length).toBeGreaterThanOrEqual(30);
    for (const route of PUBLIC_ROUTES) {
      const head = headTags(route).map((tag) => `${JSON.stringify(tag.attributes)}${tag.text ?? ""}`).join("\n");
      expect(head).not.toMatch(PLACEHOLDER);
    }
  });
});

describe("the page nodes", () => {
  it("keeps the canonical and Service node of a service page as they were", () => {
    const canonical = headTags("water-heaters").find((tag) => tag.attributes.rel === "canonical");
    expect(canonical?.attributes.href).toBe("https://drplumbingheating.com/water-heaters/");
    const service = graphNode("water-heaters", "#service");
    expect(service.name).toBe("Water heaters");
    expect(service.provider).toEqual({ "@id": "https://drplumbingheating.com/#business" });
    expect(service.areaServed).toHaveLength(28);
  });
});
