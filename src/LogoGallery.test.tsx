// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { LogoGallery } from "./LogoGallery";

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
  expect(handAndPipe.getByRole("img").getAttribute("viewBox")).toBe("580 791 376 196");
  expect(handAndPipe.getByRole("link").getAttribute("href"))
    .toBe("/?logo=14&logoVersion=mono&previewTheme=dark");
});

it("restores the selected design's dark-ink artwork from an incoming gallery link", () => {
  window.history.replaceState(null, "", "/brand-comparison/?logo=14&logoVersion=mono&previewTheme=dark");
  render(<LogoGallery />);

  const handAndPipe = within(screen.getByRole("article", { name: "Hand and pipe" }));
  expect((handAndPipe.getByRole("radio", { name: "Dark ink" }) as HTMLInputElement).checked).toBe(true);
  expect(handAndPipe.getByRole("img").getAttribute("viewBox")).toBe("580 791 376 196");
  expect(handAndPipe.getByRole("link").getAttribute("href"))
    .toBe("/?logo=14&logoVersion=mono&previewTheme=dark");
  expect(document.documentElement.dataset.previewTheme).toBe("dark");
  const signedDr = within(screen.getByRole("article", { name: "Signed Dr" }));
  expect((signedDr.getByRole("radio", { name: "Color" }) as HTMLInputElement).checked).toBe(true);
});

it("restores the URL's background after Back from a section with a different theme", async () => {
  render(<LogoGallery />);
  window.history.pushState(null, "", "/brand-comparison/?previewTheme=light#finalist");
  fireEvent.click(screen.getByRole("radio", { name: "Dark website" }));
  window.history.back();

  await waitFor(() => {
    expect(window.location.search).toBe("?previewTheme=light");
    expect(document.documentElement.dataset.previewTheme).toBe("light");
    expect((screen.getByRole("radio", { name: "Light website" }) as HTMLInputElement).checked).toBe(true);
  });
});
