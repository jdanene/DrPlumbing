/** The four owner-supplied references, retained unchanged for preview only. */
export const LOGO_OPTIONS = [
  { id: "1", name: "Gold and silver", width: 1290, height: 906 },
  { id: "2", name: "Interlocking serif", width: 1290, height: 836 },
  { id: "3", name: "Bold geometric", width: 1290, height: 934 },
  { id: "4", name: "White on navy", width: 1290, height: 870 },
] as const;

/**
 * Description: Resolves an explicit logo choice without changing the normal site.
 * Inputs: search is a URL query string; only the supplied options 1–4 are valid.
 * Output: Matching reference, or null for a missing or invalid choice.
 * Examples: LogoPreview.test.tsx checks ?logo=1, ?logo=4, ?logo=0 and an empty query.
 */
export function logoOptionFromSearch(search: string) {
  const id = new URLSearchParams(search).get("logo");
  return LOGO_OPTIONS.find((option) => option.id === id) ?? null;
}

/**
 * Description: Keeps the comparison choice while browsing the existing website.
 * Inputs: url is an already-validated same-origin page link; search is the current query.
 * Output: Updates only the logo parameter; explicit choices and other URL parts remain intact.
 * Examples: LogoPreview.test.tsx checks a service anchor, another query and an explicit switch.
 */
export function preserveLogoOption(url: URL, search: string) {
  const option = logoOptionFromSearch(search);
  if (option && !url.searchParams.has("logo")) url.searchParams.set("logo", option.id);
}
