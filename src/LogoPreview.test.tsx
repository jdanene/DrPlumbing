// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { logoOptionFromSearch, preserveLogoOption } from "./logoPreviewOptions";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it.each([["?logo=1", "1"], ["?logo=4", "4"], ["?logo=0", null], ["", null]])(
  "resolves only supplied logo options from %s", (search, option) => {
    expect(logoOptionFromSearch(search)?.id ?? null).toBe(option);
  },
);

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
