// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { SERVICES } from "./content";
import { resolveRoute } from "./routes";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Description: Exercises the public hash-navigation contract without relying on jsdom's navigation timers.
 * Inputs: hash is a destination such as #about or an unknown fragment.
 * Output: A synchronous hash-change event processed within React's test boundary.
 * Examples: The navigation tests below move from #boilers to #book and retain the service.
 */
function navigate(hash: string) {
  act(() => {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

describe("routes", () => {
  it.each([
    ["", "home"],
    ["#", "home"],
    ["#unknown", "home"],
    ["#boilers", "boilers"],
    ["#home-reviews", "home-reviews"],
  ])("resolves %s to %s", (hash, route) => {
    expect(resolveRoute(hash)).toBe(route);
  });
});

describe("reference pages", () => {
  it("keeps the original hero, van, values, service tiles, and clear draft notice", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Plumbing, heating and cooling for your home.",
    );
    expect(
      screen.getByRole("img", { name: /Sprinter wrap mockup, driver side/ }),
    ).toBeDefined();
    expect(
      screen.getByText(
        /Business claims, reviews, and service areas await owner approval/,
      ),
    ).toBeDefined();
    expect(screen.getByText(/© 2026 Dr Plumbing & Heating LLC/)).toBeDefined();
    expect(screen.queryByText(/Heating Group LLC/)).toBeNull();
    const main = within(screen.getByRole("main"));
    for (const service of SERVICES) {
      expect(
        main
          .getByRole("link", {
            name: new RegExp(
              service.short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            ),
          })
          .getAttribute("href"),
      ).toBe(`#${service.id}`);
    }
    expect(main.getByText("Pricing [Confirm]")).toBeDefined();
  });

  it("renders each service including prose-only boiler sections", () => {
    render(<App />);
    for (const service of SERVICES) {
      navigate(`#${service.id}`);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        service.title,
      );
      expect(document.activeElement).toBe(
        screen.getByRole("heading", { level: 1 }),
      );
      const tabs = within(screen.getByRole("navigation", { name: "Services" }));
      expect(
        tabs
          .getByRole("link", { name: service.tab })
          .getAttribute("aria-current"),
      ).toBe("page");
    }
    expect(
      screen.getByText(/Hydronic heat is efficient, even and quiet/),
    ).toBeDefined();
    expect(
      within(
        screen.getByRole("navigation", { name: "Other services" }),
      ).queryByRole("link", { name: "Boilers" }),
    ).toBeNull();
  });

  it("renders services, About, homepage sections, and unknown-route recovery", () => {
    render(<App />);
    navigate("#services");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Our services",
    );
    expect(
      screen.getByRole("heading", { name: "Not sure which service you need?" }),
    ).toBeDefined();
    expect(
      within(screen.getByRole("main"))
        .getByRole("link", { name: "Book a visit" })
        .getAttribute("href"),
    ).toBe("#book");
    navigate("#about");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "A family business on your street.",
    );
    expect(screen.getByText("Pricing [Confirm]")).toBeDefined();
    expect(screen.getByText("Mehran")).toBeDefined();
    navigate("#home-area");
    expect(document.activeElement?.textContent).toBe(
      "Service area [Confirm].",
    );
    navigate("#home-reviews");
    expect(document.activeElement?.textContent).toBe("Customer reviews");
    navigate("#not-real");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Plumbing, heating and cooling for your home.",
    );
  });

  it("carries the visited service into the booking preview and handles direct booking", () => {
    render(<App />);
    navigate("#book");
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(
      "Not sure",
    );
    navigate("#boilers");
    navigate("#book");
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(
      "Boilers",
    );
  });

  it("filters placeholder projects and keeps the selected filter focused", async () => {
    const user = userEvent.setup();
    render(<App />);
    navigate("#work");
    expect(screen.getAllByRole("article")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: "Water heaters" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Water heaters" }),
    );
    await user.click(screen.getByRole("button", { name: "Boilers" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen
        .getByRole("button", { name: "Boilers" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });
});

describe("shared controls", () => {
  it("opens the service dropdown, closes outside and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", {
      name: "Plumbing",
    });
    await user.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    await user.click(screen.getByRole("heading", { level: 1 }));
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await user.click(button);
    await user.keyboard("{Escape}");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("locks background scroll while the mobile drawer is open and restores on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("navigation", { name: "Mobile" }).hidden).toBe(
      false,
    );
    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Open menu" }),
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    navigate("#about");
    expect(document.body.style.overflow).toBe("");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("saves light and dark selection and supports the system setting", () => {
    render(<App />);
    const select = screen.getByLabelText("Appearance");
    fireEvent.change(select, { target: { value: "dark" } });
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("dr-plumbing-theme")).toBe("dark");
    fireEvent.change(select, { target: { value: "light" } });
    expect(document.documentElement.dataset.theme).toBe("light");
    fireEvent.change(select, { target: { value: "system" } });
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
