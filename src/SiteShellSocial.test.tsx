// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SiteShell from "./SiteShell";

// vi.mock is hoisted above the imports, so this file sees a record whose social profiles the
// owner has confirmed. It lives apart from SiteShell.test.tsx, which needs the real pending record.
vi.mock("./businessFacts", async (importOriginal) => {
  const original = await importOriginal<typeof import("./businessFacts")>();
  return {
    ...original,
    BUSINESS: {
      ...original.BUSINESS,
      socialProfiles: original.confirmedFact(
        [{ label: "Yelp", url: "https://www.yelp.com/biz/dr-plumbing-newcastle" }],
        "Test fixture",
        "2026-10-11",
      ),
    },
  };
});

afterEach(cleanup);

describe("footer social links once the profiles are confirmed", () => {
  it("renders one rel=me link per profile with its label", () => {
    render(<SiteShell route="home"><main id="main" /></SiteShell>);
    const footer = within(screen.getByRole("contentinfo"));
    const socialLinks = footer.getAllByRole("link").filter((link) => link.getAttribute("rel")?.includes("me"));
    expect(socialLinks).toHaveLength(1);
    expect(socialLinks[0]?.textContent).toBe("Yelp");
    expect(socialLinks[0]?.getAttribute("href")).toBe("https://www.yelp.com/biz/dr-plumbing-newcastle");
    expect(socialLinks[0]?.getAttribute("target")).toBe("_blank");
  });
});
