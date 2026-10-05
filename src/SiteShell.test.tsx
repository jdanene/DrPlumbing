// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SiteShell from "./SiteShell";
import { CallToAction } from "./SiteContent";

beforeEach(() => {
  localStorage.clear();
});

afterEach(cleanup);

describe("reference footer and contact invitation", () => {
  it("keeps the grouped services, company links, credentials, and approved contact details", () => {
    render(<SiteShell route="home"><main /></SiteShell>);
    const footer = screen.getByRole("contentinfo");
    const groups = Array.from(footer.querySelectorAll(".foot-sub"));
    expect(groups.map((group) => group.textContent?.toLowerCase())).toEqual([
      "plumbing",
      "heating & cooling",
    ]);
    const company = within(footer).getByRole("heading", { name: "Company" }).parentElement!;
    expect(within(company).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "About us",
      "Our work",
      "Reviews",
      "Areas we serve",
      "FAQ",
      "Book a visit",
    ]);
    expect(within(footer).getByText("Licensed · Bonded · Insured")).toBeDefined();
    expect(within(footer).getByText("© 2026 Dr Plumbing & Heating Group LLC")).toBeDefined();
    expect(within(footer).getByRole("link", { name: "(206) 671-8888" }).getAttribute("href")).toBe("tel:2066718888");
    expect(within(footer).getByRole("link", { name: "drplumbinggroup@gmail.com" }).getAttribute("href")).toBe("mailto:drplumbinggroup@gmail.com");
    expect(within(footer).queryByRole("link", { name: "Text" })).toBeNull();
    expect(within(footer).getByRole("combobox", { name: "Appearance" })).toBeDefined();
  });

  it("matches the live site's contact message and three actions", () => {
    const { container } = render(<CallToAction title="Something leaking, cold or broken?" />);
    expect(container.querySelector(".cta p")?.textContent).toBe(
      "Call or text (206) 671-8888, or send a request online. We will confirm the next step.",
    );
    expect(screen.getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Book a visit", "#book"],
      ["Call now", "tel:2066718888"],
      ["Text us", "sms:+12066718888"],
    ]);
  });
});
