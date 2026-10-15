// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { LOGO_OPTIONS, logoOptionFromSearch, preserveLogoOption, previewHref } from "./logoPreviewOptions";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it.each([["?logo=1", "1"], ["?logo=4", "4"], ["?logo=14", "14"], ["?logo=original", "original"], ["?logo=0", null], ["", null]])(
  "resolves only supplied logo options from %s", (search, option) => {
    expect(logoOptionFromSearch(search)?.id ?? null).toBe(option);
  },
);

it("keeps fourteen finalists, four references and the current logo in one catalog", () => {
  expect(LOGO_OPTIONS).toHaveLength(19);
  expect(LOGO_OPTIONS.filter((option) => option.group === "finalist")).toHaveLength(14);
  expect(new Set(LOGO_OPTIONS.map((option) => option.id)).size).toBe(19);
});

it("preserves version and background through navigation and explicit logo changes", () => {
  const url = new URL("https://preview.example/about/?source=nav#story");
  preserveLogoOption(url, "?logo=14&logoVersion=mono&previewTheme=dark");
  expect(url.searchParams.get("logo")).toBe("14");
  expect(url.searchParams.get("logoVersion")).toBe("mono");
  expect(url.searchParams.get("previewTheme")).toBe("dark");
  expect(url.hash).toBe("#story");
  expect(previewHref("/about/?logo=14&logoVersion=mono&previewTheme=dark&source=nav#story", { logo: "original" }))
    .toBe("/about/?logo=original&logoVersion=mono&previewTheme=dark&source=nav#story");
});

it("shows the supplied hand-and-pipe dark-ink inset without duplicate service wording", () => {
  window.history.replaceState(null, "", "/?logo=14&logoVersion=mono&previewTheme=dark");
  localStorage.setItem("dr-plumbing-theme-v2", "light");
  render(<App />);
  const header = within(screen.getByRole("banner"));
  expect(header.getByRole("img", { name: "Hand and pipe — dark ink" }).getAttribute("viewBox")).toBe("580 791 376 196");
  expect(document.querySelector(".preview-brand-words")).toBeNull();
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("dr-plumbing-theme-v2")).toBe("light");
  fireEvent.click(header.getByRole("link", { name: "About" }));
  expect(window.location.search).toBe("?logo=14&logoVersion=mono&previewTheme=dark");
});

it("falls back to supplied color when an option has no dark-ink artwork", () => {
  window.history.replaceState(null, "", "/?logo=6&logoVersion=mono");
  render(<App />);
  expect(within(screen.getByRole("banner")).getByRole("img", { name: "Violet nameplate — color" })).toBeDefined();
  expect(screen.getByRole("combobox", { name: "Logo version" }).hasAttribute("disabled")).toBe(true);
});

it("offers the current logo as an explicit comparison choice", () => {
  window.history.replaceState(null, "", "/?logo=original");
  render(<App />);
  expect(screen.getByRole("navigation", { name: "Logo comparison" })).toBeDefined();
  expect(document.querySelector(".brand-lockup img")?.getAttribute("src")).toContain("/brand/dr-logo.svg");
});

it("carries the logo through internal navigation without changing other parameters or anchors", () => {
  const url = new URL("https://preview.example/boilers/?source=menu#projects");
  preserveLogoOption(url, "?logo=3");
  expect(url.pathname + url.search + url.hash).toBe("/boilers/?source=menu&logo=3#projects");
  const explicit = new URL("https://preview.example/?logo=2");
  preserveLogoOption(explicit, "?logo=3");
  expect(explicit.search).toBe("?logo=2");
});

it.each(["1", "2", "3", "4"])("shows logo %s in header and footer while keeping contact actions", (id) => {
  window.history.replaceState(null, "", `/?logo=${id}`);
  render(<App />);
  const header = within(screen.getByRole("banner"));
  const footer = within(screen.getByRole("contentinfo"));
  expect(header.getByRole("img", { name: `Logo option ${id}` }).getAttribute("src")).toBe(`/brand/logo-options/option-${id}.jpeg`);
  expect(footer.getByRole("img", { name: `Logo option ${id}` })).toBeDefined();
  expect(header.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("href")).toBe("tel:2066718888");
  fireEvent.click(header.getByRole("link", { name: "About" }));
  expect(window.location.pathname).toBe("/about/");
  expect(window.location.search).toBe(`?logo=${id}`);
  expect(header.getByRole("img", { name: `Logo option ${id}` })).toBeDefined();
});

it("keeps the production lockup when no option is requested", () => {
  render(<App />);
  expect(screen.queryByRole("navigation", { name: "Logo comparison" })).toBeNull();
  expect(document.querySelector(".brand-lockup img")?.getAttribute("src")).toContain("/brand/dr-logo.svg");
});

it("matches the selected logo palette without changing the saved website theme", () => {
  window.history.replaceState(null, "", "/?logo=6&previewTheme=matched");
  localStorage.setItem("dr-plumbing-theme-v2", "dark");
  const { unmount } = render(<App />);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(document.documentElement.dataset.logoPalette).toBe("6");
  expect(document.documentElement.style.getPropertyValue("--accent")).toBe("#6a38ad");
  expect(localStorage.getItem("dr-plumbing-theme-v2")).toBe("dark");
  expect(screen.getByRole("combobox", { name: "Preview background" }).getAttribute("aria-label")).toBeTruthy();
  const url = new URL("https://preview.example/about/");
  preserveLogoOption(url, window.location.search);
  expect(url.searchParams.get("previewTheme")).toBe("matched");
  unmount();
  expect(document.documentElement.dataset.logoPalette).toBeUndefined();
  expect(document.documentElement.style.getPropertyValue("--accent")).toBe("");
});

it("clips finalist artwork to its approved region and removes its presentation canvas", () => {
  window.history.replaceState(null, "", "/?logo=7");
  render(<App />);
  const artwork = within(screen.getByRole("banner")).getByRole("img", { name: "Evergreen circle — color" });
  expect(artwork.querySelector("clipPath rect")?.getAttribute("width")).toBe("1430");
  expect(artwork.querySelector("image")?.getAttribute("filter")).toMatch(/^url\(#/);
  expect(document.documentElement.dataset.logoPreview).toBe("7");
});
