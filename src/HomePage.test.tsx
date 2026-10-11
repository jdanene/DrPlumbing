// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./HomePage";
import { SERVICES } from "./content";
import { routeHref } from "./sitePaths";
import { PHOTOS } from "./projectPhotos";

afterEach(cleanup);

describe("the redesigned homepage", () => {
  it("offers calling and texting beside the number in the closing section", () => {
    render(<HomePage />);
    const closing = within(screen.getByRole("heading", { name: "Let’s take care of it." }).closest("section")!);
    expect(closing.getByText("(206) 671-8888")).toBeDefined();
    expect(closing.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("href")).toBe("tel:+12066718888");
    expect(closing.getByRole("link", { name: "Text (206) 671-8888" }).getAttribute("href")).toBe("sms:+12066718888");
  });

  it("exposes each service as a direct link", () => {
    render(<HomePage />);
    const index = within(screen.getByRole("navigation", { name: "Choose a service" }));
    expect(index.getAllByRole("link")).toHaveLength(6);
    for (const service of SERVICES) {
      expect(index.getByRole("link", { name: service.tab }).getAttribute("href")).toBe(routeHref(service.id));
    }
  });

  it("keeps real job photos distinct and reserves eager loading for the opening", () => {
    render(<HomePage />);
    const photos = screen.getAllByRole("img");
    expect(new Set(photos.map(photo => photo.getAttribute("src"))).size).toBe(photos.length);
    expect(photos.filter(photo => photo.getAttribute("loading") === "eager")).toHaveLength(1);
    expect(photos[0]?.getAttribute("alt")).toContain("Gloved hands");
    expect(photos[0]?.getAttribute("src")).toBe(PHOTOS.copperPressDetail.src);
  });

  it("keeps answers collapsed until requested and preserves the booking destination", () => {
    render(<HomePage />);
    const summary = screen.getByText("How does your pricing work?");
    expect(summary.closest("details")?.open).toBe(false);
    fireEvent.click(summary);
    expect(summary.closest("details")?.open).toBe(true);
    expect(screen.getAllByRole("link", { name: "Book a visit" }).every(link => link.getAttribute("href") === "/book/")).toBe(true);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
