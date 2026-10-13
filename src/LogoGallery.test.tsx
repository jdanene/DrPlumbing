// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { LogoGallery } from "./LogoGallery";
import { logoPalette } from "./logoPalettes";

beforeEach(() => {
  window.history.replaceState(null, "", "/brand-comparison/");
});
afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.previewTheme;
});

it("shows all fifteen designs and offers only the five supplied dark-ink variants", () => {
  render(<LogoGallery />);
  expect(screen.getAllByRole("article")).toHaveLength(15);
  expect(screen.getAllByRole("radio", { name: "Dark ink" })).toHaveLength(5);
  expect(within(screen.getByRole("article", { name: "Gold and silver" })).queryByRole("radio")).toBeNull();
  expect(within(screen.getByRole("article", { name: "Current website logo" })).getByRole("link").getAttribute("href"))
    .toBe("/?logo=original&logoVersion=color&previewTheme=light");
});

it("changes website background without recoloring artwork and links the selected supplied version", () => {
  render(<LogoGallery />);
  const originalArtwork = screen.getAllByRole("img").map((image) => image.outerHTML);
  fireEvent.click(screen.getByRole("radio", { name: "Dark website" }));
  expect(document.documentElement.dataset.previewTheme).toBe("dark");
  expect(screen.getAllByRole("img").map((image) => image.outerHTML)).toEqual(originalArtwork);

  const handAndPipe = within(screen.getByRole("article", { name: "Hand and pipe" }));
  fireEvent.click(handAndPipe.getByRole("radio", { name: "Dark ink" }));
  expect(handAndPipe.getByRole("img", { name: "Hand and pipe — dark ink" })).toBeDefined();
  expect(handAndPipe.getByRole("link").getAttribute("href"))
    .toBe("/?logo=14&logoVersion=mono&previewTheme=dark");
});

it("restores the selected design's dark-ink artwork from an incoming gallery link", () => {
  window.history.replaceState(null, "", "/brand-comparison/?logo=14&logoVersion=mono&previewTheme=dark");
  render(<LogoGallery />);

  const handAndPipe = within(screen.getByRole("article", { name: "Hand and pipe" }));
  expect((handAndPipe.getByRole("radio", { name: "Dark ink" }) as HTMLInputElement).checked).toBe(true);
  expect(handAndPipe.getByRole("img", { name: "Hand and pipe — dark ink" })).toBeDefined();
  expect(handAndPipe.getByRole("link").getAttribute("href"))
    .toBe("/?logo=14&logoVersion=mono&previewTheme=dark");
  expect(document.documentElement.dataset.previewTheme).toBe("dark");
  const signedDr = within(screen.getByRole("article", { name: "Signed Dr" }));
  expect((signedDr.getByRole("radio", { name: "Color" }) as HTMLInputElement).checked).toBe(true);
});

it("matches each artwork panel to its logo without applying a palette to the gallery root", () => {
  render(<LogoGallery />);
  fireEvent.click(screen.getByRole("radio", { name: "Match logo" }));

  for (const [name, id] of [["Hand and pipe", "14"], ["Violet nameplate", "6"]]) {
    const card = screen.getByRole("article", { name });
    const swatch = card.querySelector<HTMLElement>(".gallery-artwork");
    expect(swatch?.dataset.palette).toBe(logoPalette(id).name);
    expect(swatch?.style.getPropertyValue("--bg")).toBe(logoPalette(id).style["--bg"]);
    expect(within(card).getByRole("link").getAttribute("href"))
      .toBe(`/?logo=${id}&logoVersion=color&previewTheme=matched`);
  }
  expect(document.documentElement.dataset.previewTheme).toBe("matched");
  expect(document.documentElement.style.getPropertyValue("--bg")).toBe("");
  expect(window.location.search).toBe("?previewTheme=matched");
});

it("restores matched background and dark-ink artwork from an incoming gallery link", () => {
  window.history.replaceState(null, "", "/brand-comparison/?logo=14&logoVersion=mono&previewTheme=matched");
  render(<LogoGallery />);

  expect((screen.getByRole("radio", { name: "Match logo" }) as HTMLInputElement).checked).toBe(true);
  const handAndPipe = within(screen.getByRole("article", { name: "Hand and pipe" }));
  expect((handAndPipe.getByRole("radio", { name: "Dark ink" }) as HTMLInputElement).checked).toBe(true);
  expect(handAndPipe.getByRole("link").getAttribute("href"))
    .toBe("/?logo=14&logoVersion=mono&previewTheme=matched");
});

it.each([["light", "Light website"], ["matched", "Match logo"]])("restores %s background after Back from a section with a different theme", async (theme, label) => {
  window.history.replaceState(null, "", `/brand-comparison/?previewTheme=${theme}`);
  render(<LogoGallery />);
  window.history.pushState(null, "", `/brand-comparison/?previewTheme=${theme}#finalist`);
  fireEvent.click(screen.getByRole("radio", { name: "Dark website" }));
  window.history.back();

  await waitFor(() => {
    expect(window.location.search).toBe(`?previewTheme=${theme}`);
    expect(document.documentElement.dataset.previewTheme).toBe(theme);
    expect((screen.getByRole("radio", { name: label }) as HTMLInputElement).checked).toBe(true);
  });
});
