// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { CITY_OPTION_PAGES, CITY_SERVICE_PAGES } from "./cities";
import { renderPage } from "./prerender";
import { routeFromLocation } from "./routes";
import { PUBLIC_ROUTES, headTags } from "./seo";
import { PATH_REDIRECTS, routeHref } from "./sitePaths";

const replicas = [
  { slug: "federal-way", name: "Federal Way" },
  { slug: "newcastle", name: "Newcastle" },
];
const referenceRoutes = PUBLIC_ROUTES.filter((route) => route.startsWith("areas/mercer-island"));

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe.each(replicas)("$name replicates Mercer Island", ({ slug, name }) => {
  it("has the same overview, six categories, and 35 options", () => {
    expect(PUBLIC_ROUTES.filter((route) => route === `areas/${slug}` || route.startsWith(`areas/${slug}/`))).toHaveLength(42);
    expect(CITY_SERVICE_PAGES.filter((page) => page.citySlug === slug)).toHaveLength(6);
    expect(CITY_OPTION_PAGES.filter((page) => page.citySlug === slug)).toHaveLength(35);
    expect(routeHref(`areas/${slug}`)).toBe(`/plumber-${slug}/`);
    expect(PATH_REDIRECTS[`/areas-we-serve/${slug}/`]).toBe(`areas/${slug}`);
  });

  it.each(referenceRoutes)("preserves the content, pictures, and links of %s", (referenceRoute) => {
    const route = referenceRoute.replace("mercer-island", slug);
    expect(PUBLIC_ROUTES).toContain(route);
    const path = routeHref(route);
    expect(path).toBe(routeHref(referenceRoute).replace("mercer-island", slug));
    expect(routeFromLocation(path)).toBe(route);
    const reference = document.createElement("div");
    reference.innerHTML = renderPage(referenceRoute).body;
    const replica = document.createElement("div");
    replica.innerHTML = renderPage(route).body;
    // Compare the entire visible page, including images and internal links, after location substitution.
    expect(replica.querySelector("main")!.innerHTML).toBe(reference.querySelector("main")!.innerHTML
      .replaceAll("Mercer Island", name).replaceAll("mercer-island", slug)
      .replaceAll("MERCER ISLAND", name.toUpperCase()));
    const tags = headTags(route);
    expect(tags.find((tag) => tag.tag === "title")!.text).toContain(name);
    expect(tags.find((tag) => tag.attributes.rel === "canonical")!.attributes.href).toBe(`https://drplumbingheating.com${path}`);
    const graph = JSON.parse(tags.find((tag) => tag.tag === "script")!.text!)["@graph"];
    expect(graph.find((node: Record<string, unknown>) => node["@type"] === "Service").areaServed)
      .toEqual([{ "@type": "City", name }]);
  });

  it("keeps desktop, mobile and footer navigation in the city", () => {
    window.history.replaceState(null, "", `/plumber-${slug}/`);
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Plumbing" }));
    expect(within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", { name: "Gas water heaters" }).getAttribute("href"))
      .toBe(`/gas-water-heaters-${slug}/`);
    expect(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Boilers" }).getAttribute("href"))
      .toBe(`/boilers-${slug}/`);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(within(screen.getByRole("navigation", { name: "Mobile" })).getByRole("link", { name: /Water heaters/ }).getAttribute("href"))
      .toBe(`/water-heater-replacement-${slug}/`);
  });

  it("walks gas → electric → tankless → boilers and preselects booking", () => {
    window.history.replaceState(null, "", `/water-heater-replacement-${slug}/`);
    render(<App />);
    for (const label of ["Gas water heaters", "Electric water heaters", "Tankless water heaters", "Boilers"]) {
      fireEvent.click(within(screen.getByRole("main")).getByRole("link", { name: label }));
      expect(window.location.pathname).toContain(`-${slug}/`);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(name);
    }
    fireEvent.click(within(screen.getByRole("main")).getAllByRole("link", { name: "Book a visit" })[0]);
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Boilers");
  });
});
