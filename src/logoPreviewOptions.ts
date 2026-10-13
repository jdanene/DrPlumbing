export type LogoVersion = "color" | "mono";
export type PreviewTheme = "light" | "dark" | "matched";
type ArtworkBounds = readonly [x: number, y: number, width: number, height: number];

/** Original image coordinates frame each approved lockup without changing its pixels. */
export interface LogoOption {
  id: string;
  name: string;
  group: "current" | "reference" | "finalist";
  src: string;
  width: number;
  height: number;
  color?: ArtworkBounds;
  mono?: ArtworkBounds;
  plateOutline?: string;
}

/** Shared by the website controls and gallery. IDs 1–4 retain their original links. */
export const LOGO_OPTIONS: readonly LogoOption[] = [
  { id: "original", name: "Current website logo", group: "current", src: "/brand/dr-logo.svg?v=20261004-3", width: 180, height: 46 },
  { id: "1", name: "Gold and silver", group: "reference", src: "/brand/logo-options/option-1.jpeg", width: 1290, height: 906 },
  { id: "2", name: "Interlocking serif", group: "reference", src: "/brand/logo-options/option-2.jpeg", width: 1290, height: 836 },
  { id: "3", name: "Bold geometric", group: "reference", src: "/brand/logo-options/option-3.jpeg", width: 1290, height: 934 },
  { id: "4", name: "White on navy", group: "reference", src: "/brand/logo-options/option-4.jpeg", width: 1290, height: 870 },
  { id: "5", name: "Graphite and orange DR", group: "finalist", src: "/brand/logo-options/15-stencil-dr.png", width: 1536, height: 1024, color: [142, 158, 1258, 679] },
  { id: "6", name: "Violet nameplate", group: "finalist", src: "/brand/logo-options/03-craft-wordmark.png", width: 1536, height: 1024, color: [60, 288, 1418, 434], plateOutline: "68,504 73,493 90,458 155,325 166,303 168,300 171,298 175,296 1363,296 1367,298 1371,302 1374,308 1404,369 1432,426 1448,459 1460,484 1469,503 1470,509 1470,510 1469,516 1400,655 1374,707 1369,712 1365,714 172,714 168,712 163,707 155,691 69,518 68,515" },
  { id: "7", name: "Evergreen circle", group: "finalist", src: "/brand/logo-options/08-name-circle.png", width: 1536, height: 1024, color: [59, 47, 1430, 905] },
  { id: "8", name: "Navy and blue DR", group: "finalist", src: "/brand/logo-options/10-built-monogram.png", width: 1536, height: 1024, color: [211, 189, 1115, 643] },
  { id: "9", name: "Brick maker’s mark", group: "finalist", src: "/brand/logo-options/07-maker-tile.png", width: 1536, height: 1024, color: [305, 106, 927, 811], plateOutline: "313,481 314,114 1224,114 1224,727 1203,748 1078,870 1039,908 1032,909 314,909 313,908" },
  { id: "10", name: "Signed Dr", group: "finalist", src: "/brand/logo-options/19-signed-name.png", width: 1536, height: 1024, color: [84, 214, 1368, 375], mono: [534, 773, 467, 133] },
  { id: "11", name: "At your door", group: "finalist", src: "/brand/logo-options/23-at-your-door.png", width: 1536, height: 1024, color: [216, 109, 1148, 554], mono: [553, 727, 430, 204] },
  { id: "12", name: "At your door · cap", group: "finalist", src: "/brand/logo-options/32-at-your-door-cap.png", width: 1536, height: 1024, color: [216, 109, 1148, 554], mono: [553, 726, 430, 205] },
  { id: "13", name: "Kingfisher", group: "finalist", src: "/brand/logo-options/25-kingfisher.png", width: 1536, height: 1024, color: [142, 132, 1311, 540], mono: [486, 722, 563, 235] },
  { id: "14", name: "Hand and pipe", group: "finalist", src: "/brand/logo-options/24-steady-hand.png", width: 1536, height: 1024, color: [160, 110, 1218, 642], mono: [580, 791, 376, 196] },
];

/**
 * Description: Resolves an explicit logo choice without changing the ordinary site.
 * Inputs: search is a URL query string; IDs must match the catalog.
 * Output: Matching option, or null for a missing or invalid choice.
 * Examples: LogoPreview.test.tsx covers first/last options, original, invalid and empty queries.
 */
export function logoOptionFromSearch(search: string) {
  const id = new URLSearchParams(search).get("logo");
  return LOGO_OPTIONS.find((option) => option.id === id) ?? null;
}

/**
 * Description: Selects only artwork supplied for the chosen design.
 * Inputs: search is the preview query; option is the selected catalog entry.
 * Output: mono only when requested and available; otherwise color.
 * Examples: LogoPreview.test.tsx covers hand-and-pipe mono and nameplate color fallback.
 */
export function logoVersionFromSearch(search: string, option: LogoOption): LogoVersion {
  return option.mono && new URLSearchParams(search).get("logoVersion") === "mono" ? "mono" : "color";
}

/**
 * Description: Gives shared previews a predictable background, independent of saved preferences.
 * Inputs: search is a query string from a valid logo preview.
 * Output: dark or matched when explicitly requested; otherwise light.
 * Examples: LogoPreview.test.tsx checks dark links and the default light preview.
 */
export function previewThemeFromSearch(search: string): PreviewTheme {
  const theme = new URLSearchParams(search).get("previewTheme");
  return theme === "dark" || theme === "matched" ? theme : "light";
}

/**
 * Description: Changes comparison controls without dropping the current page or anchor.
 * Inputs: href is a local page or current absolute URL; changes are explicit preview choices.
 * Output: A same-site path, query and hash. Unrelated query parameters remain intact.
 * Examples: LogoPreview.test.tsx switches to original while preserving background and anchor.
 */
export function previewHref(href: string, changes: Partial<{ logo: string; logoVersion: LogoVersion; previewTheme: PreviewTheme }>) {
  const url = new URL(href, "https://preview.invalid");
  for (const [key, value] of Object.entries(changes)) url.searchParams.set(key, value);
  return url.pathname + url.search + url.hash;
}

/**
 * Description: Keeps valid comparison settings while browsing the existing website.
 * Inputs: url is an already-validated same-origin link; search is the current query.
 * Output: Adds missing preview parameters. Explicit choices and other URL parts stay intact.
 * Examples: LogoPreview.test.tsx checks service anchors, explicit switches and dark-ink navigation.
 */
export function preserveLogoOption(url: URL, search: string) {
  const option = logoOptionFromSearch(search);
  if (!option) return;
  const current = new URLSearchParams(search);
  if (!url.searchParams.has("logo")) url.searchParams.set("logo", option.id);
  if (!url.searchParams.has("logoVersion") && current.has("logoVersion")) {
    url.searchParams.set("logoVersion", logoVersionFromSearch(search, option));
  }
  if (!url.searchParams.has("previewTheme") && current.has("previewTheme")) {
    url.searchParams.set("previewTheme", previewThemeFromSearch(search));
  }
}
