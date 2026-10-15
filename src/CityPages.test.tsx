// @vitest-environment jsdom
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import AreasPage from "./AreasPage";
import { BUSINESS, confirmed } from "./businessFacts";
import {
  CITY_LANDMARKS,
  CITY_OPTION_PAGES,
  CITY_PAGES,
  CITY_SERVICE_PAGES,
  cityAnswer,
  cityHeading,
  cityLandmarksText,
  cityPageAt,
  serviceHrefFor,
} from "./cities";
import { SERVICES, serviceMenu } from "./content";
import { renderPage } from "./prerender";
import { resolveRoute, routeFromLocation } from "./routes";
import { PUBLIC_ROUTES, SITE_ORIGIN, headTags } from "./seo";
import { CITY_PATHS, PATH_REDIRECTS, routeHref } from "./sitePaths";

/** A bracketed capitalized label such as [BELLEVUE LANDMARKS]; JSON arrays use brackets too. */
const PLACEHOLDER = /\[[A-Z][A-Z ]*\]/;

const bellevue = cityPageAt(["bellevue"])!;
const bellevueWaterHeaters = cityPageAt(["bellevue", "water-heaters"])!;
const waterHeaters = SERVICES.find((service) => service.id === "water-heaters")!;

/**
 * Description: Opens a city through the same URL the browser uses.
 * Inputs: route is a known internal city route.
 * Output: Mounted app at its public path; history is reset before each test.
 * Examples: The Bellevue and Mercer Island rendering checks below exercise this helper.
 */
function renderCity(route: string) {
  window.history.replaceState(null, "", routeHref(route));
  return render(<App />);
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

/** Parses the page's JSON-LD graph so tests can read one node by type. */
function graphNodes(route: string, type: string) {
  const script = headTags(route).find((tag) => tag.tag === "script")!;
  const graph = JSON.parse(script.text!)["@graph"] as Record<string, unknown>[];
  return graph.filter((node) => node["@type"] === type);
}

describe("city addresses", () => {
  it.each([
    ["#areas/bellevue", "areas/bellevue"],
    ["#areas/Bellevue", "areas/bellevue"],
    ["#areas/nowhere", "areas"],
    ["#areas/", "areas"],
    ["#areas", "areas"],
    ["#areas/bellevue/water-heaters", "areas/bellevue/water-heaters"],
    ["#areas/bellevue/boilers", "areas/bellevue"],
    ["#areas/newcastle/water-heaters", "areas/newcastle"],
  ])("resolves %s to %s", (hash, route) => {
    expect(resolveRoute(hash)).toBe(route);
  });

  it.each([
    ["/areas-we-serve/newcastle/", "areas/newcastle"],
    ["/areas-we-serve/east-hill-meridian/", "areas/east-hill-meridian"],
    ["/areas-we-serve/bellevue/water-heaters/", "areas/bellevue/water-heaters"],
    ["/areas-we-serve/", "areas"],
    ["/areas-we-serve/nowhere/", "not-found"],
    ["/areas-we-serve/bellevue/boilers/", "not-found"],
    ["/areas-we-serve/bellevue/water-heaters/extra/", "not-found"],
  ])("maps the path %s to %s", (pathname, route) => {
    expect(routeFromLocation(pathname)).toBe(route);
  });

  it("joins the city and service into one public path", () => {
    expect(routeHref("areas/bellevue/water-heaters")).toBe("/areas-we-serve/bellevue/water-heaters/");
    expect(routeHref("areas/newcastle")).toBe("/areas-we-serve/newcastle/");
  });

  it("uses the requested flat Mercer Island path and retains the old bookmark", () => {
    expect(routeHref("areas/mercer-island")).toBe("/plumber-mercer-island/");
    expect(routeFromLocation("/plumber-mercer-island/")).toBe("areas/mercer-island");
    expect(routeFromLocation("/areas-we-serve/mercer-island/")).toBe("areas/mercer-island");
  });

  it("keeps every city alias crawlable at one canonical address", () => {
    for (const [route, href] of Object.entries(CITY_PATHS)) {
      expect(PUBLIC_ROUTES).toContain(route);
      expect(routeFromLocation(href)).toBe(route);
      expect(routeFromLocation(href.slice(0, -1))).toBe(route);
      expect(routeFromLocation(`${href}extra/`)).toBe("not-found");
      expect(headTags(route).find((tag) => tag.attributes.rel === "canonical")?.attributes.href).toBe(`${SITE_ORIGIN}${href}`);
    }
    for (const [oldPath, route] of Object.entries(PATH_REDIRECTS)) {
      expect(routeFromLocation(oldPath)).toBe(route);
      expect(routeFromLocation(oldPath.slice(0, -1))).toBe(route);
    }
  });

  it("resolves a city by name or slug, keeps the service only when listed, and rejects an unknown city", () => {
    expect(cityPageAt(["Bellevue"])).toEqual(bellevue);
    expect(bellevue).toMatchObject({ route: "areas/bellevue", city: { name: "Bellevue", slug: "bellevue" } });
    expect(bellevue.service).toBeUndefined();
    expect(bellevueWaterHeaters.route).toBe("areas/bellevue/water-heaters");
    expect(bellevueWaterHeaters.service).toBe(waterHeaters);
    expect(cityPageAt(["bellevue", "boilers"])).toEqual(bellevue);
    expect(cityPageAt(["nowhere"])).toBeUndefined();
    expect(cityPageAt([])).toBeUndefined();
  });
});

describe("the city record", () => {
  it("lists one page per served city and the allowlisted city-and-service pages, with no duplicates", () => {
    const cities = confirmed(BUSINESS.serviceCities);
    expect(CITY_PAGES.map((city) => city.name)).toEqual([...cities]);
    const cityRoutes = PUBLIC_ROUTES.filter((route) => route.startsWith("areas/"));
    expect(cityRoutes).toEqual([...cities.map((name) => `areas/${cityPageAt([name])!.city.slug}`), ...CITY_SERVICE_PAGES.map((entry) => `areas/${entry.citySlug}/${entry.slug ?? entry.serviceId}`), ...CITY_OPTION_PAGES.map((entry) => entry.route)]);
    expect(new Set(PUBLIC_ROUTES).size).toBe(PUBLIC_ROUTES.length);
    expect(PUBLIC_ROUTES).toHaveLength(101);
  });

  it("names only served cities and existing services in its hand-written tables", () => {
    const slugs = CITY_PAGES.map((city) => city.slug);
    for (const slug of Object.keys(CITY_LANDMARKS)) expect(slugs).toContain(slug);
    for (const entry of CITY_SERVICE_PAGES) {
      expect(slugs).toContain(entry.citySlug);
      expect(SERVICES.map((service) => service.id)).toContain(entry.serviceId);
    }
  });

  it("keeps every city's landmarks pending until the owner supplies them", () => {
    expect(bellevue.city.landmarks).toEqual({ status: "pending", placeholder: "[BELLEVUE LANDMARKS]" });
    const landmarks = cityPageAt(["East Hill-Meridian"])!.city.landmarks;
    expect(landmarks.status === "pending" && landmarks.placeholder).toBe("[EAST HILL MERIDIAN LANDMARKS]");
    expect(cityLandmarksText(bellevue)).toBe("[BELLEVUE LANDMARKS]");
    vi.stubEnv("PROD", true);
    expect(cityLandmarksText(bellevue)).toBeUndefined();
  });

  it("writes the heading and the answer from the facts alone", () => {
    expect(cityHeading(bellevue)).toBe("Plumber in Bellevue, WA");
    expect(cityHeading(bellevueWaterHeaters)).toBe("Water heaters in Bellevue, WA");
    expect(cityAnswer(bellevue)).toBe(
      "Dr Plumbing & Heating repairs and installs plumbing for homes in Bellevue, WA. Tell us whether you need help with a leak, a blocked drain, a fixture or a larger plumbing project. You approve a flat-rate price before work starts.",
    );
    expect(cityAnswer(bellevueWaterHeaters)).toBe(
      `Dr Plumbing & Heating serves homes in Bellevue, WA. ${waterHeaters.lead} You approve a flat-rate price before work starts.`,
    );
    expect(cityAnswer(bellevue)).not.toContain("response");
  });
});

describe("city metadata", () => {
  it("scopes the Bellevue page to Bellevue alone", () => {
    const tags = headTags("areas/bellevue");
    expect(tags.find((tag) => tag.tag === "title")?.text).toBe("Plumber in Bellevue, WA | Dr Plumbing & Heating");
    expect(tags.find((tag) => tag.attributes.rel === "canonical")?.attributes.href).toBe("https://drplumbingheating.com/areas-we-serve/bellevue/");
    expect(tags.find((tag) => tag.attributes.name === "description")?.attributes.content).toContain("You approve a flat-rate price before work starts.");
    const [service] = graphNodes("areas/bellevue", "Service");
    expect(service.areaServed).toEqual([{ "@type": "City", name: "Bellevue" }]);
    expect(service.name).toBe("Plumber in Bellevue, WA");
    const [crumbs] = graphNodes("areas/bellevue", "BreadcrumbList");
    expect((crumbs.itemListElement as { name: string }[]).map((crumb) => crumb.name)).toEqual(["Home", "Areas we serve", "Bellevue"]);
  });

  it("adds the service to the Bellevue water-heaters page", () => {
    const route = "areas/bellevue/water-heaters";
    expect(headTags(route).find((tag) => tag.tag === "title")?.text).toBe("Water heaters in Bellevue, WA | Dr Plumbing & Heating");
    expect(graphNodes(route, "Service")[0].areaServed).toEqual([{ "@type": "City", name: "Bellevue" }]);
    const [crumbs] = graphNodes(route, "BreadcrumbList");
    expect((crumbs.itemListElement as { name: string }[]).map((crumb) => crumb.name)).toEqual(["Home", "Areas we serve", "Bellevue", "Water heaters"]);
  });

  it("never lets a placeholder into a city page's head", () => {
    for (const route of PUBLIC_ROUTES.filter((item) => item.startsWith("areas/"))) {
      const head = headTags(route).map((tag) => `${JSON.stringify(tag.attributes)}${tag.text ?? ""}`).join("\n");
      expect(head).not.toMatch(PLACEHOLDER);
    }
  });
});

describe("city pages", () => {
  it("gives all six Mercer Island service links distinct city pages", () => {
    renderCity("areas/mercer-island");
    const links = within(screen.getByRole("navigation", { name: "Services in Mercer Island" })).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/plumbing-mercer-island/", "/water-heater-replacement-mercer-island/",
      "/drain-and-sewer-mercer-island/", "/water-filtration-mercer-island/",
      "/heating-and-cooling-mercer-island/", "/boilers-mercer-island/",
    ]);
    for (const link of links) {
      const route = routeFromLocation(link.getAttribute("href")!);
      expect(PUBLIC_ROUTES).toContain(route);
      expect(renderPage(route).body).toContain("Mercer Island, WA");
      expect(graphNodes(route, "Service")[0].areaServed).toEqual([{ "@type": "City", name: "Mercer Island" }]);
    }
  });

  it.each([
    ["plumbing", "General plumbing in Mercer Island, WA"],
    ["drain-sewer", "Drain and sewer services in Mercer Island, WA"],
    ["water-filtration", "Water filtration in Mercer Island, WA"],
    ["heating-cooling", "Heating and cooling in Mercer Island, WA"],
    ["boilers", "Boiler services in Mercer Island, WA"],
  ])("renders Mercer Island %s with guidance and the correct booking service", (serviceId, heading) => {
    renderCity(`areas/mercer-island/${serviceId}`);
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1 }).textContent).toBe(heading);
    expect(main.getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(4);
    expect(within(main.getByRole("navigation", { name: "Breadcrumb" })).getByRole("link", { name: "Mercer Island" }).getAttribute("href")).toBe("/plumber-mercer-island/");
    act(() => {
      window.history.pushState(null, "", "/book/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(SERVICES.find((item) => item.id === serviceId)!.tab);
  });

  it.each([
    ["areas/bellevue", "Plumber in Bellevue, WA"],
    ["areas/mercer-island", "Plumber in Mercer Island, WA"],
    ["areas/mercer-island/water-heater-replacement", "Water heater replacement in Mercer Island, WA"],
  ])("renders and prerenders the requested search topic %s", (route, heading) => {
    expect(routeFromLocation(routeHref(route))).toBe(route);
    expect(PUBLIC_ROUTES).toContain(route);
    renderCity(route);
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1 }).textContent).toBe(heading);
    expect(main.getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(4);
    const { body, head } = renderPage(route);
    expect(body).toContain(heading);
    expect(head).toContain(`${SITE_ORIGIN}${routeHref(route)}`);
    expect(headTags(route).find((tag) => tag.tag === "title")?.text).toContain(heading);
    expect(main.getByRole("link", { name: "Call now" }).getAttribute("href")).toBe("tel:2066718888");
    expect(main.getByRole("link", { name: "Text us" }).getAttribute("href")).toBe("sms:+12066718888");
  });

  it("links Mercer Island to replacement guidance and retains the service selection in booking", () => {
    const mercer = cityPageAt(["mercer-island"])!;
    expect(serviceHrefFor(mercer, "water-heaters")).toBe("/water-heater-replacement-mercer-island/");
    renderCity("areas/mercer-island/water-heater-replacement");
    act(() => {
      window.history.pushState(null, "", "/book/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Water heaters");
  });

  it("answers first in Bellevue and links every service", () => {
    renderCity("areas/bellevue");
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1 }).textContent).toBe("Plumber in Bellevue, WA");
    expect(screen.getByRole("main").textContent).toContain("You approve a flat-rate price before work starts.");
    expect(screen.getByRole("main").textContent).toContain("[BELLEVUE LANDMARKS]");
    const links = within(main.getByRole("navigation", { name: "Services in Bellevue" })).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(SERVICES.map((service) => service.tab));
    expect(links.map((link) => link.getAttribute("href"))).toEqual(SERVICES.map((service) => serviceHrefFor(bellevue, service.id)));
    expect(within(main.getByRole("navigation", { name: "Breadcrumb" })).getByRole("link", { name: "Areas we serve" }).getAttribute("href")).toBe("/areas-we-serve/");
  });

  it("sends a Bellevue visitor to the Bellevue water-heaters page and everyone else to the service", () => {
    expect(serviceHrefFor(bellevue, "water-heaters")).toBe("/areas-we-serve/bellevue/water-heaters/");
    expect(serviceHrefFor(bellevue, "boilers")).toBe("/boilers/");
    expect(serviceHrefFor(cityPageAt(["newcastle"])!, "water-heaters")).toBe("/water-heaters/");
  });

  it("shows nothing in place of pending landmarks in production", () => {
    vi.stubEnv("PROD", true);
    renderCity("areas/bellevue");
    expect(screen.getByRole("main").textContent).not.toContain("[");
  });

  it("lists the water-heater options in Bellevue and links the full service page", () => {
    renderCity("areas/bellevue/water-heaters");
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1 }).textContent).toBe("Water heaters in Bellevue, WA");
    expect(screen.getByRole("main").textContent).toContain(waterHeaters.lead);
    const options = within(main.getByRole("navigation", { name: "Water heaters in Bellevue" })).getAllByRole("link");
    expect(options.map((link) => link.textContent)).toEqual(serviceMenu(waterHeaters));
    expect(options[0].getAttribute("href")).toBe("/water-heaters/electric-water-heaters/");
    expect(main.getByRole("link", { name: "More about water heaters" }).getAttribute("href")).toBe("/water-heaters/");
    expect(within(main.getByRole("navigation", { name: "Breadcrumb" })).getByRole("link", { name: "Bellevue" }).getAttribute("href")).toBe("/areas-we-serve/bellevue/");
    expect(main.queryByRole("heading", { name: "Our water heater services" })).toBeNull();
  });

  it("preselects the service in booking after a city-and-service page, and nothing after a city page", () => {
    renderCity("areas/bellevue/water-heaters");
    act(() => {
      window.history.pushState(null, "", "/book/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Water heaters");
    cleanup();
    renderCity("areas/bellevue");
    act(() => {
      window.history.pushState(null, "", "/book/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Not sure");
  });

  it("prerenders Newcastle with its name in the body", () => {
    const { body, head } = renderPage("areas/newcastle");
    expect(body).toContain("Newcastle");
    expect(body).toContain("Plumbing, heating and cooling in Newcastle, WA");
    expect(head).toContain("/areas-we-serve/newcastle/");
  });

  it("links every served city from the areas page", () => {
    render(<AreasPage />);
    const list = within(screen.getByRole("list", { name: "" }) ?? screen.getByRole("list"));
    for (const city of CITY_PAGES) {
      expect(list.getByRole("link", { name: city.name }).getAttribute("href")).toBe(routeHref(`areas/${city.slug}`));
    }
  });
});
