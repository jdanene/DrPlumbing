// @vitest-environment jsdom
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SERVICES } from "./content";
import { DETAIL_PHOTOS, HOME_PROJECTS, PHOTOS, SERVICE_PHOTOS } from "./projectPhotos";
import { ServicePage } from "./SiteContent";

afterEach(cleanup);

describe("reviewed photo placements", () => {
  it("uses heating equipment, not bathroom fixtures, for the HVAC hero", () => {
    expect(SERVICE_PHOTOS["heating-cooling"]).toBe(PHOTOS.unitHeater);
    expect(DETAIL_PHOTOS["heating-cooling/ventilation"]).toBeUndefined();
    expect(HOME_PROJECTS.some(project => project.photo === PHOTOS.unitHeater)).toBe(false);
    expect(DETAIL_PHOTOS["plumbing/faucets-fixtures-and-sinks"]).toBe(PHOTOS.basin);
  });

  it("shows the circulation pump photo beside the circulation explanation", () => {
    const service = SERVICES.find(item => item.id === "boilers")!;
    const { container } = render(<ServicePage service={service} />);
    const section = container.querySelector<HTMLElement>("#circulation")!;
    expect(within(section).getByRole("heading", { name: "Circulation" })).toBeDefined();
    const image = within(section).getByRole("img", { name: PHOTOS.circulators.alt });
    expect(image.getAttribute("src")).toBe(PHOTOS.circulators.src);
    expect(image.getAttribute("width")).toBe("1200");
    expect(image.parentElement?.style.aspectRatio).toBe("1200 / 1600");
  });

  it("uses classified photos from their reviewed service folders", () => {
    const catalog = JSON.parse(readFileSync("design/photo-classification/catalog.json", "utf8")) as {
      photos: { id: number; assignments: string[]; status: string }[];
    };
    const selection = JSON.parse(readFileSync("design/photo-classification/best-selection.json", "utf8")) as {
      categories: Record<string, { picks: number[] }>;
    };
    for (const photo of Object.values(PHOTOS)) {
      expect(existsSync(resolve("public", photo.src.slice(1))), photo.src).toBe(true);
      const match = photo.src.match(/by-service\/(.+?)\/(best\/)?(\d+)_/)!;
      const source = catalog.photos.find(item => item.id === Number(match[3]));
      expect(source?.status, photo.src).toBe("classified");
      expect(source?.assignments, photo.src).toContain(match[1]);
      if (match[2]) expect(selection.categories[match[1]].picks, photo.src).toContain(Number(match[3]));
      expect(photo.alt.length).toBeGreaterThan(15);
    }
  });
});
