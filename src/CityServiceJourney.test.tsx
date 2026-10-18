// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { CITY_OPTION_PAGES, CITY_SERVICE_PAGES, cityPageAt, serviceHrefFor } from "./cities";
import { SERVICES, serviceMenu } from "./content";
import { renderPage } from "./prerender";
import { serviceDetailFor } from "./serviceDetails";
import { routeFromLocation } from "./routes";
import { PUBLIC_ROUTES, headTags } from "./seo";
import { pathSlug, routeHref } from "./sitePaths";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Mercer Island service journeys", () => {
  it.each(SERVICES.map((service) => [service.id]))("retains the main %s page's photos and educational sections", (serviceId) => {
    const entry = CITY_SERVICE_PAGES.find((item) => item.citySlug === "mercer-island" && item.serviceId === serviceId)!;
    const original = document.createElement("div");
    original.innerHTML = renderPage(serviceId).body;
    const city = document.createElement("div");
    city.innerHTML = renderPage(`areas/mercer-island/${entry.slug ?? serviceId}`).body;
    expect([...city.querySelectorAll("main img")].map((img) => img.getAttribute("src"))).toEqual([...original.querySelectorAll("main img")].map((img) => img.getAttribute("src")));
    expect([...city.querySelectorAll(".svc-sec h2, .svc-sec h3, .svc-sec p")].map((node) => node.textContent)).toEqual([...original.querySelectorAll(".svc-sec h2, .svc-sec h3, .svc-sec p")].map((node) => node.textContent));
    const options = city.querySelector(`nav[aria-label="${SERVICES.find((service) => service.id === serviceId)!.tab} in Mercer Island"]`);
    expect(options?.querySelectorAll("a").length).toBe(serviceMenu(SERVICES.find((service) => service.id === serviceId)!).length);
  });

  it("leaves unselected cities' service menus and site-wide options unchanged", () => {
    expect([...new Set(CITY_OPTION_PAGES.map((item) => item.citySlug))]).toEqual(["mercer-island", "federal-way", "newcastle"]);
    expect(new Set(CITY_OPTION_PAGES.map((item) => routeHref(item.route))).size).toBe(105);
    window.history.replaceState(null, "", "/areas-we-serve/bellevue/");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Plumbing" }));
    expect(within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", { name: "Gas water heaters" }).getAttribute("href")).toBe("/water-heaters/gas-water-heaters/");
    expect(serviceHrefFor(cityPageAt(["renton"]), "boilers", "Boiler repair")).toBe("/boilers/#boiler-repair-and-replacement");
  });

  it("keeps header, mobile and footer services in Mercer Island", () => {
    window.history.replaceState(null, "", "/plumber-mercer-island/");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Plumbing" }));
    const mainMenu = within(screen.getByRole("navigation", { name: "Main" }));
    expect(mainMenu.getByRole("link", { name: "Gas water heaters" }).getAttribute("href")).toBe("/gas-water-heaters-mercer-island/");
    fireEvent.click(screen.getByRole("button", { name: "Heating & Cooling" }));
    expect(mainMenu.getByRole("link", { name: "Boiler repair" }).getAttribute("href")).toBe("/boiler-repair-mercer-island/");
    expect(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Boilers" }).getAttribute("href")).toBe("/boilers-mercer-island/");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(within(screen.getByRole("navigation", { name: "Mobile" })).getByRole("link", { name: /Water heaters/ }).getAttribute("href")).toBe("/water-heater-replacement-mercer-island/");
  });

  it("walks from gas to electric to tankless and boilers without losing the city", () => {
    window.history.replaceState(null, "", "/water-heater-replacement-mercer-island/");
    render(<App />);
    for (const label of ["Gas water heaters", "Electric water heaters", "Tankless water heaters"]) {
      const main = within(screen.getByRole("main"));
      fireEvent.click(main.getByRole("link", { name: label }));
      expect(window.location.pathname).toBe(`/${pathSlug(label)}-mercer-island/`);
      expect(main.getByRole("heading", { level: 1 }).textContent).toBe(`${label} in Mercer Island, WA`);
    }
    fireEvent.click(within(screen.getByRole("main")).getByRole("link", { name: "Boilers" }));
    expect(window.location.pathname).toBe("/boilers-mercer-island/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Boiler services in Mercer Island, WA");
  });

  it.each(SERVICES.flatMap((service) => serviceMenu(service).map((label) => [service.id, label]))) (
    "gives %s / %s a city destination with rendered content and metadata", (serviceId, label) => {
      const service = SERVICES.find((item) => item.id === serviceId)!;
      const destination = service.optionTargets?.[label];
      const isCategory = SERVICES.some((item) => item.id === destination);
      const path = isCategory ? "/water-filtration-mercer-island/" : `/${pathSlug(label)}-mercer-island/`;
      const route = routeFromLocation(path);
      expect(route).not.toBe("not-found");
      expect(PUBLIC_ROUTES).toContain(route);
      expect(routeHref(route)).toBe(path);
      const { body, head } = renderPage(route);
      expect(body).toContain(`${isCategory ? "Water filtration" : label} in Mercer Island, WA`);
      expect(head).toContain(`https://drplumbingheating.com${path}`);
      expect(headTags(route).find((tag) => tag.tag === "title")?.text).toContain("Mercer Island");
      if (!isCategory) {
        const option = CITY_OPTION_PAGES.find((item) => item.route === route)!;
        expect(option.detail.sections.length).toBeGreaterThan(0);
        for (const section of option.detail.sections) {
          if (section.heading) expect(body).toContain(section.heading.replace(/&/g, "&amp;"));
        }
        expect(body).toContain(`href="${serviceHrefFor(cityPageAt(["mercer-island"]), serviceId)}"`);
        const originalDetail = serviceDetailFor(serviceId, label);
        if (originalDetail) {
          const original = document.createElement("div");
          original.innerHTML = renderPage(`${serviceId}/${pathSlug(label)}`).body;
          const city = document.createElement("div");
          city.innerHTML = body;
          expect([...city.querySelectorAll("main img")].map((img) => img.getAttribute("src"))).toEqual([...original.querySelectorAll("main img")].map((img) => img.getAttribute("src")));
        }
      }
      const schema = JSON.parse(headTags(route).find((tag) => tag.tag === "script")!.text!)["@graph"];
      expect(schema.find((node: Record<string, unknown>) => node["@type"] === "Service").areaServed).toEqual([{ "@type": "City", name: "Mercer Island" }]);
    },
  );
});
