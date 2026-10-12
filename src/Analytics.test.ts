// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { init } from "mappack-web-analytics";
import { GA_MEASUREMENT_ID, PRODUCTION_HOSTS, startAnalytics } from "./analytics";
vi.mock("mappack-web-analytics", () => ({ init: vi.fn() }));
afterEach(() => vi.clearAllMocks());
it("passes the recorded Measurement ID and only the production hosts", () => {
  startAnalytics();
  expect(init).toHaveBeenCalledWith({ measurementId: "G-XD2J39S66V", hosts: ["drplumbingheating.com", "www.drplumbingheating.com"] });
  expect(GA_MEASUREMENT_ID).toMatch(/^G-[A-Z0-9]+$/);
});
it("injects no tag and sends no event on a preview with a configured test ID", async () => {
  const real = await vi.importActual<typeof import("mappack-web-analytics")>("mappack-web-analytics");
  const preview = { location: { hostname: "branch.pages.dev" } } as Window;
  expect(real.init({ measurementId: "G-TEST", hosts: PRODUCTION_HOSTS, win: preview }).enabled).toBe(false);
  real.track("book_start");
  expect(document.scripts.length).toBe(0);
  expect(preview).not.toHaveProperty("dataLayer");
});
