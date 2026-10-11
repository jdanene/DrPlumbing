// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { SERVICES } from "./content";
import { resolveRoute } from "./routes";
import { WORK_PROJECTS } from "./projectPhotos";

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
 * Description: Simulates browser navigation without jsdom's click timers.
 * Inputs: href is a local path, optionally with a section or legacy hash.
 * Output: A history entry and React route update.
 * Examples: /book/ opens booking; /#home-faq focuses its heading.
 */
function navigate(href: string) {
  act(() => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("navigation", () => {
  it.each([["", "home"], ["#unknown", "home"], ["#boilers", "boilers"], ["#home-faq", "home-faq"]])(
    "keeps legacy bookmark %s resolving to %s", (hash, route) => {
      expect(resolveRoute(hash)).toBe(route);
    },
  );

  it("renders each service and focuses its heading", () => {
    render(<App />);
    for (const service of SERVICES) {
      navigate(`/#${service.id}`);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe(service.title);
      expect(document.activeElement).toBe(heading);
      expect(within(screen.getByRole("navigation", { name: "Services" }))
        .getByRole("link", { name: service.tab }).getAttribute("aria-current")).toBe("page");
      expect(window.location.hash).toBe("");
    }
  });

  it("keeps About, homepage anchors, and missing-page recovery accessible", async () => {
    render(<App />);
    navigate("/about/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("A family business on your street.");
    for (const anchor of ["home-services", "home-area", "home-reviews", "home-faq"]) {
      navigate(`/#${anchor}`);
      expect(document.activeElement).toBe(document.getElementById(anchor)?.querySelector("h2"));
    }
    navigate("/missing/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Page not found.");
    await userEvent.click(screen.getByRole("link", { name: "Find your service" }));
    expect(window.location.pathname).toBe("/services/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Plumbing, heating & cooling services");
  });

  it("carries the visited service into booking and supports direct booking", () => {
    render(<App />);
    navigate("/book/");
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Not sure");
    navigate("/boilers/");
    navigate("/book/");
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe("Boilers");
  });

  it("filters real projects and keeps the selected filter focused", async () => {
    render(<App />);
    navigate("/our-work/");
    expect(screen.getAllByRole("article")).toHaveLength(WORK_PROJECTS.length);
    const filter = screen.getByRole("button", { name: "Water heaters" });
    await userEvent.click(filter);
    expect(screen.getAllByRole("article")).toHaveLength(WORK_PROJECTS.filter(project => project.category === "Water heaters").length);
    expect(document.activeElement).toBe(filter);
    expect(filter.getAttribute("aria-pressed")).toBe("true");
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(WORK_PROJECTS.length);
  });
});

describe("shared controls", () => {
  it("closes the dropdown outside and restores focus on Escape", async () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "Plumbing" });
    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    await userEvent.click(screen.getByRole("heading", { level: 1 }));
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("restores background scroll after drawer dismissal or navigation", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("navigation", { name: "Mobile" }).hidden).toBe(false);
    await userEvent.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    navigate("/about/");
    expect(document.body.style.overflow).toBe("");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("saves theme choices and supports the system setting", () => {
    render(<App />);
    const select = screen.getByLabelText("Appearance") as HTMLSelectElement;
    expect(select.value).toBe("light");
    fireEvent.change(select, { target: { value: "dark" } });
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("dr-plumbing-theme")).toBe("dark");
    fireEvent.change(select, { target: { value: "light" } });
    expect(document.documentElement.dataset.theme).toBe("light");
    fireEvent.change(select, { target: { value: "system" } });
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
