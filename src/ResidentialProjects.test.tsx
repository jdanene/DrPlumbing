// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import BathroomRemodeling from "./BathroomRemodeling";
import { SERVICES } from "./content";
import { DETAIL_PHOTOS, EQUIPMENT_PROJECTS, PHOTOS, REMODELING_PROJECTS, RESIDENTIAL_PROJECTS, SERVICE_GALLERIES, WORK_PROJECTS } from "./projectPhotos";
import { FULL_SERVICE_CITY_SLUGS } from "./sitePaths";
import { ServicePage } from "./SiteContent";
import { serviceDetailFor, serviceNavigationMenu, serviceOptionHref } from "./serviceDetails";
import { CITY_OPTION_PAGES, cityPageAt, serviceHrefFor } from "./cities";
import { PUBLIC_ROUTES } from "./seo";
import { renderPage } from "./prerender";
import WorkPage from "./WorkPage";

afterEach(cleanup);

describe("additive residential project placement", () => {
  it("puts Plumbing before bathroom remodeling in the Our Work filters", () => {
    render(<WorkPage />);
    const filters = within(screen.getByRole("group", { name: "Filter projects" }));
    expect(filters.getAllByRole("button").slice(0, 3).map(button => button.textContent)).toEqual([
      "All", "Plumbing", "Complete bathroom remodeling",
    ]);
  });

  it.each([
    ["Plumbing", [PHOTOS.concreteTrenching, PHOTOS.equipmentConnections]],
    ["Boilers", [PHOTOS.heatingPlant, PHOTOS.boilerCloset, PHOTOS.completedBoiler]],
    ["Drain & sewer", [PHOTOS.sewerConnection]],
    ["Water filtration", [PHOTOS.treatmentVessels]],
  ] as const)("places screenshot-selected originals in the %s filter", async (category, photos) => {
    render(<WorkPage />);
    await userEvent.click(screen.getByRole("button", { name: category }));
    for (const photo of photos) expect(screen.getByRole("img", { name: photo.alt }).getAttribute("src")).toBe(photo.src);
  });

  it("uses each equipment project once and retains a matching service destination", () => {
    for (const project of Object.values(EQUIPMENT_PROJECTS)) {
      expect(WORK_PROJECTS.filter(item => item.photo.src === project.photo.src)).toHaveLength(1);
      expect(SERVICE_GALLERIES[project.service]?.projects).toContain(project);
    }
  });

  it("adds the missing sink photos while retaining the toilet fixture", () => {
    const projects = SERVICE_GALLERIES["plumbing/complete-bathroom-remodeling#faucets-fixtures-and-sinks"]!.projects;
    expect(projects.map(project => project.photo)).toEqual([PHOTOS.doubleVanity, PHOTOS.basin, PHOTOS.sinkInProgress, PHOTOS.electronicToilet]);
    expect(SERVICE_GALLERIES["plumbing/toilet-repair-and-installation"]!.projects).toContain(RESIDENTIAL_PROJECTS.electronicToilet);
  });

  it.each(FULL_SERVICE_CITY_SLUGS)("keeps the added project photos on matching %s routes", city => {
    for (const project of Object.values(EQUIPMENT_PROJECTS)) {
      const { body } = renderPage(`areas/${city}/${project.service}`);
      expect(body).toContain(project.photo.src);
    }
  });
  it("replaces the rejected radiator and shows each boiler image under the correct heading", () => {
    expect(DETAIL_PHOTOS["boilers/boiler"]).toBe(PHOTOS.completedBoiler);
    expect(DETAIL_PHOTOS["boilers/radiators-baseboards-or-radiant-flooring"]).toBe(PHOTOS.towelRadiator);
    for (const route of ["boilers", "work", ...FULL_SERVICE_CITY_SLUGS.map(city => `areas/${city}/boilers`)]) {
      const { body } = renderPage(route);
      expect(body).not.toContain("086_IMG_3535");
      expect(body).toContain(PHOTOS.completedBoiler.src);
    }
  });
  it("separates bathroom remodeling from the existing plumbing projects", async () => {
    render(<WorkPage />);
    const remodeling = screen.getByRole("button", { name: "Complete bathroom remodeling" });
    await userEvent.click(remodeling);
    expect(remodeling.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("heading", { name: "Steam shower" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Sink installation in progress" })).toBeDefined();
    expect(screen.queryByRole("heading", { name: "Underground drilling equipment" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "More of our work" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Plumbing" }));
    for (const name of ["Underground drilling equipment", "Water-supply line", "Fixture-by-fixture water supply", "Supply and drain rough-in"]) {
      expect(screen.getByRole("heading", { name })).toBeDefined();
    }
    expect(screen.queryByRole("heading", { name: "Steam shower" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Sink installation in progress" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(WORK_PROJECTS.length);
  });
  it("features complete bathroom remodeling in Our Work without duplicating or dropping projects", () => {
    render(<WorkPage />);
    const section = within(screen.getByRole("region", { name: "Complete bathroom remodeling" }));
    expect(section.getAllByRole("article")).toHaveLength(REMODELING_PROJECTS.length);
    for (const photo of [PHOTOS.remodeledBathroom, PHOTOS.customShower, PHOTOS.doubleVanity, PHOTOS.rainShower, PHOTOS.finishedTub]) {
      expect(section.getByRole("img", { name: photo.alt })).toBeDefined();
    }
    expect(screen.getAllByRole("article")).toHaveLength(WORK_PROJECTS.length);
    expect(section.getAllByRole("link", { name: /Explore bathroom remodeling/ }).every(link => link.getAttribute("href") === "/plumbing/complete-bathroom-remodeling/")).toBe(true);
  });
  it("leads with General plumbing and uses the owner-selected technician photo", () => {
    render(<ServicePage service={SERVICES.find(item => item.id === "plumbing")!} />);
    const services = within(screen.getByRole("navigation", { name: "Services" }));
    expect(services.getAllByRole("link").slice(0, 2).map(link => link.textContent)).toEqual([
      "General plumbing", "Complete bathroom remodeling",
    ]);
    expect(services.getByRole("link", { name: "Complete bathroom remodeling" }).getAttribute("href")).toBe("/plumbing/complete-bathroom-remodeling/");
    expect(screen.queryByRole("link", { name: "Read more about Complete bathroom remodeling" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Our plumbing services" })).toBeDefined();
    expect(screen.getByRole("img", { name: "Residential water heater installation by Dr Plumbing & Heating" }).getAttribute("src")).toContain("176_IMG_8591 2.jpg");
  });

  it("links the homepage introduction to the dedicated remodeling page", () => {
    render(<BathroomRemodeling />);
    expect(screen.getByRole("link", { name: /Explore bathroom remodeling/ }).getAttribute("href")).toBe("/plumbing/complete-bathroom-remodeling/");
    expect(screen.getByRole("img").getAttribute("loading")).toBe("lazy");
  });

  it("puts remodeling first and groups fixture and shower menu entries", () => {
    const menu = serviceNavigationMenu(SERVICES.find(item => item.id === "plumbing")!);
    expect(menu[0]).toBe("Complete bathroom remodeling");
    expect(menu.filter(item => item === "Complete bathroom remodeling")).toHaveLength(1);
    expect(menu).not.toContain("Faucets, fixtures and sinks");
    expect(menu).not.toContain("Showers and tubs");
    expect(serviceOptionHref("plumbing", "Showers and tubs")).toBe("/plumbing/showers-and-tubs/");
    expect(serviceDetailFor("plumbing", "Faucets, fixtures and sinks")).toBeDefined();
  });

  it.each(FULL_SERVICE_CITY_SLUGS) ("keeps the remodeling journey in %s", city => {
    const route = `areas/${city}/plumbing/complete-bathroom-remodeling`;
    const path = `/complete-bathroom-remodeling-${city}/`;
    expect(serviceHrefFor(cityPageAt([city]), "plumbing", "Complete bathroom remodeling")).toBe(path);
    expect(PUBLIC_ROUTES).toContain(route);
    const { body, head } = renderPage(route);
    expect(head).toContain(`https://drplumbingheating.com${path}`);
    const dom = document.createElement("div");
    dom.innerHTML = body;
    expect(dom.querySelector('nav[aria-label="On this page"] a')?.getAttribute("href")).toBe("#faucets-fixtures-and-sinks");
    for (const [id, photo] of [["faucets-fixtures-and-sinks", PHOTOS.doubleVanity], ["showers-and-tubs", PHOTOS.customShower], ["kitchen-remodeling", PHOTOS.kitchenSink]] as const) {
      expect(dom.querySelector(`#${id} img`)?.getAttribute("src")).toBe(photo.src);
    }
    for (const slug of ["faucets-fixtures-and-sinks", "showers-and-tubs"]) {
      expect(CITY_OPTION_PAGES.some(page => page.citySlug === city && page.slug === slug)).toBe(true);
    }
  });

  it("shows confirmed scope, section anchors and photos on the general remodeling page", () => {
    render(<ServicePage service={SERVICES.find(item => item.id === "plumbing")!} detail={serviceDetailFor("plumbing", "Complete bathroom remodeling")} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Complete bathroom remodeling");
    expect(screen.getByText(/One team to manage your complete bathroom remodel/)).toBeDefined();
    expect(screen.getByText(/We manage your bathroom remodel from start to finish/)).toBeDefined();
    const navigation = within(screen.getByRole("navigation", { name: "On this page" }));
    expect(navigation.getByRole("link", { name: "Showers and tubs" }).getAttribute("href")).toBe("#showers-and-tubs");
    expect(screen.getByRole("img", { name: PHOTOS.finishedTub.alt })).toBeDefined();
    expect(screen.getByRole("img", { name: PHOTOS.kitchenSink.alt })).toBeDefined();
    const progress = screen.getByRole("heading", { name: "Behind the finished room" }).closest("section")!;
    expect(within(progress).getByRole("img", { name: PHOTOS.sinkInProgress.alt })).toBeDefined();
  });

  it("keeps the new photos in Our Work and preserves the old bathroom projects", () => {
    for (const project of Object.values(RESIDENTIAL_PROJECTS)) expect(WORK_PROJECTS).toContain(project);
    for (const photo of [PHOTOS.bathroom, PHOTOS.bathtubRoughIn]) {
      expect(WORK_PROJECTS.some(project => project.photo === photo)).toBe(true);
    }
  });

  it.each([
    ["plumbing", "Faucets, fixtures and sinks", PHOTOS.doubleVanity],
    ["plumbing", "Toilet repair and installation", PHOTOS.wallHungToilet],
    ["plumbing", "Piping and repiping", PHOTOS.bathroomRoughIn],
    ["water-heaters", "Tankless water heaters", PHOTOS.compactTankless],
  ])("places residential evidence on %s / %s", (id, item, photo) => {
    const service = SERVICES.find(value => value.id === id)!;
    const detail = serviceDetailFor(id, item);
    expect(detail).toBeDefined();
    render(<ServicePage service={service} detail={detail} />);
    expect(screen.getByRole("img", { name: photo.alt })).toBeDefined();
    expect(screen.queryByRole("region", { name: "Complete bathroom remodeling" })).toBeNull();
  });

  it("keeps original shower images alongside the new ones", () => {
    const photos = SERVICE_GALLERIES["plumbing/showers-and-tubs"]!.projects.map(project => project.photo);
    expect(photos).toEqual([PHOTOS.shower, PHOTOS.bathtubRoughIn, PHOTOS.rainShower, PHOTOS.customShower]);
  });
});
