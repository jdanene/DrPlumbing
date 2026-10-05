// @vitest-environment jsdom
/// <reference types="node" />
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { SERVICES, serviceMenu, type Service } from "./content";
import { resolveRoute } from "./routes";
import {
  SERVICE_DETAILS,
  serviceDetailFor,
  serviceDetailSlug,
  serviceOptionHref,
} from "./serviceDetails";

const detailCases = [
  ["plumbing", "Garbage disposals"],
  ["water-heaters", "Electric water heaters"],
  ["water-heaters", "Gas water heaters"],
  ["water-heaters", "Tankless water heaters"],
  ["water-heaters", "Heat pump water heaters"],
  ["drain-sewer", "Hydrojetting"],
];

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Description: Exercises hash navigation without depending on jsdom's click timers.
 * Inputs: hash names the requested page and may be an invalid detail.
 * Output: A new browser-history entry and a rendered route update.
 * Examples: The fallback and booking-context tests below navigate real public hashes.
 */
function navigate(hash: string) {
  act(() => {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

describe("approved service content", () => {
  it("preserves every supplied detail and parent-service override verbatim", () => {
    const reference = { window: {} as {
      DRP_DETAILS: typeof SERVICE_DETAILS;
      DRP_SERVICE_TEXT: Record<string, Partial<Service>>;
    } };
    runInNewContext(readFileSync("design/mockups/v2/Organic/imports/dr-plumbing/descriptions.js", "utf8"), reference);
    expect(SERVICE_DETAILS).toEqual(reference.window.DRP_DETAILS);
    for (const [id, patch] of Object.entries(reference.window.DRP_SERVICE_TEXT)) {
      expect(SERVICES.find((service) => service.id === id)).toMatchObject(patch);
    }
    expect(Object.values(SERVICE_DETAILS).flat()).toHaveLength(6);
  });

  it("uses explicit service options instead of treating educational headings as menu labels", () => {
    expect(serviceMenu(SERVICES.find((service) => service.id === "water-heaters")!)).toEqual([
      "Electric water heaters", "Gas water heaters", "Tankless water heaters", "Heat pump water heaters",
    ]);
    expect(serviceMenu(SERVICES.find((service) => service.id === "water-filtration")!)).toEqual([
      "Water softeners", "Carbon filters", "Reverse osmosis", "Iron and sulfur filters",
    ]);
    expect(serviceMenu(SERVICES.find((service) => service.id === "boilers")!)).toEqual([
      "Hydronic heating", "Radiant floor heating", "Annual boiler service", "Boiler repair", "Boiler replacement",
    ]);
    expect(serviceMenu(SERVICES.find((service) => service.id === "heating-cooling")!)).toEqual([
      "Heating", "Ventilation", "Air conditioning", "Installation", "Maintenance", "Repair", "Emergency service",
    ]);
  });
});

describe("service detail addresses", () => {
  it.each([
    ["Gas water heaters", "gas-water-heaters"],
    [" Heating & cooling! ", "heating-and-cooling"],
    ["", ""],
  ])("normalizes %s to %s", (label, slug) => {
    expect(serviceDetailSlug(label)).toBe(slug);
  });

  it.each(detailCases)("resolves the %s / %s detail", (serviceId, title) => {
    const hash = `#${serviceId}/${serviceDetailSlug(title)}`;
    expect(serviceOptionHref(serviceId, title)).toBe(hash);
    expect(resolveRoute(hash)).toBe(hash.slice(1));
    expect(serviceDetailFor(serviceId, title)).toBe(serviceDetailFor(serviceId, serviceDetailSlug(title)));
  });

  it("retains the source parent fallback for absent details", () => {
    expect(serviceOptionHref("plumbing", "Leak detection")).toBe("#plumbing");
    expect(serviceOptionHref("plumbing", "Unknown option")).toBe("#plumbing");
    expect(serviceDetailFor("plumbing", "Unknown option")).toBeUndefined();
    expect(resolveRoute("#water-heaters/unknown")).toBe("water-heaters");
    expect(resolveRoute("#unknown/gas-water-heaters")).toBe("home");
    expect(resolveRoute("#home-faq")).toBe("home-faq");
    render(<App />);
    navigate("#water-heaters/unknown");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Water heaters");
  });
});

describe("detail-page journeys", () => {
  it.each(detailCases)("opens %s / %s directly with every educational section", (serviceId, title) => {
    window.history.replaceState(null, "", serviceOptionHref(serviceId, title));
    render(<App />);
    const detail = serviceDetailFor(serviceId, title)!;
    const main = screen.getByRole("main");
    expect(within(main).getByRole("heading", { level: 1 }).textContent).toBe(title);
    expect(document.title).toBe(`${title} — Dr Plumbing & Heating`);
    if (detail.lead) expect(within(main).getByText(detail.lead)).toBeDefined();
    expect(within(main).getByText(`PHOTO: ${detail.photo}`)).toBeDefined();
    for (const section of detail.sections) {
      if (section.heading) expect(within(main).getByRole("heading", { name: section.heading })).toBeDefined();
      if (section.intro) expect(within(main).getByText(section.intro)).toBeDefined();
      for (const paragraph of [...section.paras ?? [], ...section.after ?? []]) {
        expect(within(main).getByText(paragraph)).toBeDefined();
      }
      for (const [heading, copy] of section.items ?? []) {
        expect(within(main).getByRole("heading", { name: heading })).toBeDefined();
        if (copy) expect(within(main).getByText(copy)).toBeDefined();
      }
    }
    const parent = SERVICES.find((service) => service.id === serviceId)!;
    expect(within(screen.getByRole("navigation", { name: "Services" })).getByRole("link", { name: parent.tab }).getAttribute("aria-current")).toBe("page");
    navigate("#book");
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(parent.tab);
  });

  it("links the finder and main menu to the same detailed page", async () => {
    const user = userEvent.setup();
    render(<App />);
    const expected = "#water-heaters/tankless-water-heaters";
    expect(within(screen.getByRole("main")).getByRole("link", { name: "Tankless water heaters" }).getAttribute("href")).toBe(expected);
    await user.click(screen.getByRole("button", { name: "Plumbing" }));
    const menu = within(screen.getByRole("navigation", { name: "Main" }));
    expect(menu.getByRole("link", { name: "Tankless water heaters" }).getAttribute("href")).toBe(expected);
    await user.click(menu.getByRole("link", { name: "Tankless water heaters" }));
    await screen.findByRole("heading", { name: "Tankless water heaters", level: 1 });
    expect(screen.getByRole("button", { name: "Plumbing" }).closest(".nav-drop")?.classList.contains("is-current")).toBe(true);
  });

  it("restores read-more links, sibling navigation, parent breadcrumbs, and browser Back", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#water-heaters");
    render(<App />);
    const readMore = screen.getByRole("link", { name: "Read more about Gas water heaters" });
    expect(readMore.getAttribute("href")).toBe("#water-heaters/gas-water-heaters");
    await user.click(readMore);
    await screen.findByRole("heading", { name: "Gas water heaters", level: 1 });
    expect(within(screen.getByRole("navigation", { name: "Breadcrumb" })).getByRole("link", { name: "Water heaters" }).getAttribute("href")).toBe("#water-heaters");
    const siblings = within(screen.getByRole("navigation", { name: "More in Water heaters" }));
    expect(siblings.queryByRole("link", { name: "Gas water heaters" })).toBeNull();
    expect(siblings.getByRole("link", { name: "Electric water heaters" }).getAttribute("href")).toBe("#water-heaters/electric-water-heaters");
    expect(siblings.getByRole("link", { name: "See all" }).getAttribute("href")).toBe("#water-heaters");
    act(() => window.history.back());
    await screen.findByRole("heading", { name: "Water heaters", level: 1 });
  });
});
