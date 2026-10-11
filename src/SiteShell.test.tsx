// @vitest-environment jsdom
/// <reference types="node" />
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import SiteShell from "./SiteShell";
import { readFileSync } from "node:fs";

afterEach(cleanup);

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
  expect(header.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("href")).toBe("tel:2066718888");
  expect(header.getByRole("link", { name: "Text (206) 671-8888" }).getAttribute("href")).toBe("sms:+12066718888");
  expect(header.getByRole("link", { name: "Book a visit" }).getAttribute("href")).toBe("/book/");

  fireEvent.click(header.getByRole("button", { name: "Open menu" }));
  expect(header.getByRole("link", { name: "Call (206) 671-8888" }).getAttribute("tabindex")).toBe("-1");
  expect(header.getByRole("link", { name: "Text (206) 671-8888" }).getAttribute("tabindex")).toBe("-1");
});
