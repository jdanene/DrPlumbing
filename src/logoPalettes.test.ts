import { expect, it } from "vitest";
import { LOGO_OPTIONS } from "./logoPreviewOptions";
import { logoPalette } from "./logoPalettes";

/**
 * Description: Measures text contrast using the WCAG sRGB luminance formula.
 * Inputs: foreground and background are opaque six-digit hex colors.
 * Output: Contrast from 1 (identical) through 21 (black against white).
 * Examples: The test below verifies identical colors and black against white.
 */
function contrast(foreground: string, background: string) {
  const luminances = [foreground, background].map((hex) => {
    const channels = hex.slice(1).match(/../g)!.map((channel) => {
      const srgb = parseInt(channel, 16) / 255;
      return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  });
  return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
}

it("checks the contrast formula against its boundaries", () => {
  expect(contrast("#000000", "#ffffff")).toBe(21);
  expect(contrast("#ffffff", "#000000")).toBe(21);
  expect(contrast("#603095", "#603095")).toBe(1);
});

it("resolves violet and falls back safely for empty or unknown IDs", () => {
  expect(logoPalette("6").name).toBe("Violet and lavender");
  expect(logoPalette("").name).toBe("Copper and charcoal");
  expect(logoPalette("toString").name).toBe("Copper and charcoal");
});

it.each(LOGO_OPTIONS)("provides a complete matched palette for $id: $name", ({ id }) => {
  const palette = logoPalette(id);
  if (id !== "original") expect(palette).not.toBe(logoPalette("original"));
  for (const property of [
    "--bg", "--surface", "--tint", "--ink", "--muted", "--line", "--line-strong",
    "--accent", "--accent-hover", "--accent-ink", "--band", "--band-ink", "--band-muted",
    "--band-accent", "--logo-highlight", "--logo-on-accent", "--logo-header", "--logo-band-line",
  ] as const) {
    expect(palette.style[property], `${id} ${property}`).toMatch(/^#[0-9a-f]{6}$/);
  }
});

it.each(LOGO_OPTIONS)("keeps text, links and actions readable for $id: $name", ({ id }) => {
  const colors = logoPalette(id).style;
  const pairs: [string, string][] = [];
  for (const surface of ["--bg", "--surface", "--tint", "--logo-header"]) {
    for (const text of ["--ink", "--muted", "--accent-ink"]) pairs.push([text, surface]);
  }
  for (const text of ["--band-ink", "--band-muted", "--band-accent", "--logo-highlight"]) {
    pairs.push([text, "--band"]);
  }
  pairs.push(["--logo-on-accent", "--accent"], ["--logo-on-accent", "--accent-hover"]);
  for (const [foreground, background] of pairs) {
    expect(contrast(colors[foreground as `--${string}`], colors[background as `--${string}`]),
      `${id}: ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
});
