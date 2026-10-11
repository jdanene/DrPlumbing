// @vitest-environment jsdom
/// <reference types="node" />
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SiteShell from "./SiteShell";
import { readFileSync } from "node:fs";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

/**
 * Description: Renders the shell around an empty page and scopes queries to its footer, so each
 * footer test states only what it asserts.
 * Inputs: None; the route is always the homepage.
 * Output: The footer element and a query scope bound to it.
 * Examples: renderFooter().within.getByText("Newcastle, WA") finds the home base line.
 */
function renderFooter() {
  render(<SiteShell route="home"><main id="main" /></SiteShell>);
  const footer = screen.getByRole("contentinfo");
  return { footer, within: within(footer) };
}

it("preserves dropdown centering during the opening animation", () => {
  const redesignCss = readFileSync("src/redesign.css", "utf8");
  const reveal = redesignCss.match(/@keyframes menu-reveal \{([^\n]+)\}/)?.[1];
  expect(reveal).toBeDefined();
  expect(reveal).not.toMatch(/\btransform\s*:/);
  expect(reveal).toMatch(/translate\s*:\s*0 -6px/);
  expect(reveal).toMatch(/translate\s*:\s*0 0/);
});

it("offers the phone number, calling, texting, and booking in the header", () => {
  render(<SiteShell route="home"><main id="main" /></SiteShell>);
  const header = within(screen.getByRole("banner"));
  expect(header.getByText("(206) 671-8888")).toBeDefined();
  expect(header.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("href")).toBe("tel:+12066718888");
  expect(header.getByRole("link", { name: "Text (206) 671-8888" }).getAttribute("href")).toBe("sms:+12066718888");
  expect(header.getByRole("link", { name: "Book a visit" }).getAttribute("href")).toBe("/book/");
  expect(header.getByRole("link", { name: "Dr Plumbing & Heating, home" }).getAttribute("href")).toBe("/");

  fireEvent.click(header.getByRole("button", { name: "Open menu" }));
  expect(header.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("tabindex")).toBe("-1");
  expect(header.getByRole("link", { name: "Text (206) 671-8888" }).getAttribute("tabindex")).toBe("-1");
});

describe("footer contact facts", () => {
  it("lists the phone, home base, email and license from the business record", () => {
    const { within: footer } = renderFooter();
    expect(footer.getByRole("link", { name: "(206) 671-8888" }).getAttribute("href")).toBe("tel:+12066718888");
    expect(footer.getByText("Newcastle, WA")).toBeDefined();
    expect(footer.getByRole("link", { name: "drplumbinggroup@gmail.com" }).getAttribute("href")).toBe(
      "mailto:drplumbinggroup@gmail.com",
    );
    const license = footer.getByRole("link", { name: "WA plumbing contractor lic. DRPLUPH740ND" });
    expect(license.getAttribute("href")).toContain("LIC=DRPLUPH740ND");
    expect(footer.getByRole("link", { name: "Dr Plumbing & Heating, home" }).getAttribute("href")).toBe("/");
  });

  it("shows the hours placeholder under vitest", () => {
    const { within: footer } = renderFooter();
    expect(footer.getByText("[HOURS]")).toBeDefined();
  });

  it("shows no placeholder in a production build", () => {
    vi.stubEnv("PROD", true);
    const { footer } = renderFooter();
    expect(footer.textContent).not.toMatch(/\[[A-Z][A-Z ]*\]/);
  });

  it("credits the legal name in the copyright", () => {
    const { within: footer } = renderFooter();
    expect(footer.getByText("© 2026 Dr Plumbing & Heating Grp LLC")).toBeDefined();
  });

  it("renders no social link while the profiles are pending", () => {
    const { within: footer } = renderFooter();
    const socialLinks = footer.getAllByRole("link").filter((link) => link.getAttribute("rel")?.includes("me"));
    expect(socialLinks).toHaveLength(0);
  });
});
