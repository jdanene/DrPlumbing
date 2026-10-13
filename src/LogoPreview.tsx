import "./logoPreview.css";
import { LOGO_OPTIONS, logoVersionFromSearch, previewHref, previewThemeFromSearch, type LogoOption, type LogoVersion, type PreviewTheme } from "./logoPreviewOptions";

/**
 * Description: Displays approved artwork, framing its color or dark-ink region.
 * Inputs: option names the unchanged source image; version defaults to color.
 * Output: An accessible image or SVG viewport. Missing mono artwork falls back to color.
 * Examples: LogoPreview.test.tsx checks the hand-and-pipe inset and nameplate fallback.
 */
export function LogoArtwork({ option, version = "color" }: { option: LogoOption; version?: LogoVersion }) {
  const bounds = (version === "mono" && option.mono) || option.color;
  if (!bounds) return <img className="logo-artwork" src={option.src} alt={option.group === "reference" ? `Logo option ${option.id}` : option.name} width={option.width} height={option.height} />;
  const label = `${option.name} — ${version === "mono" && option.mono ? "dark ink" : "color"}`;
  return <svg className="logo-artwork" viewBox={bounds.join(" ")} role="img" aria-label={label} width={bounds[2]} height={bounds[3]} overflow="hidden">
    <image href={option.src} width={option.width} height={option.height} />
  </svg>;
}

/**
 * Description: Fits each logo into the header/footer without duplicating its wording.
 * Inputs: option is a catalog entry; onDark controls text added to the first four symbols.
 * Output: Full approved lockup, or supplied symbol with the existing service descriptor.
 * Examples: LogoPreview.test.tsx checks references and complete finalist lockups.
 */
export function PreviewBrand({ option, onDark }: {
  option: LogoOption; onDark: boolean;
}) {
  const version = typeof window === "undefined" ? "color" : logoVersionFromSearch(window.location.search, option);
  const fullLockup = option.group === "finalist";
  return <span className={`preview-brand preview-brand-${option.id}${onDark ? " on-dark" : ""}${fullLockup ? " preview-brand-full" : ""}`}>
    <span className="preview-brand-mark">
      <LogoArtwork option={option} version={version} />
    </span>
    {!fullLockup && <span className="preview-brand-words"><strong>PLUMBING</strong><span>HEATING &amp; COOLING</span></span>}
  </span>;
}

/**
 * Description: Makes every logo, artwork version and website background shareable.
 * Inputs: option is the valid choice for the current URL.
 * Output: Labeled native controls and a link to the complete gallery.
 * Examples: LogoPreview.test.tsx covers available versions and ordinary-site isolation.
 */
export function LogoComparisonBar({ option }: { option: LogoOption }) {
  const href = window.location.href;
  const version = logoVersionFromSearch(window.location.search, option);
  const background = previewThemeFromSearch(window.location.search);
  return <nav className="logo-comparison" aria-label="Logo comparison">
    <span className="logo-preview-notice">Logo preview<small>Production unchanged</small></span>
    <label>Design<select aria-label="Logo design" value={option.id} onChange={(event) => window.location.assign(previewHref(href, { logo: event.target.value }))}>
      {LOGO_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.id === "original" ? "Current" : item.id} · {item.name}</option>)}
    </select></label>
    <label>Artwork<select aria-label="Logo version" value={version} disabled={!option.mono} onChange={(event) => window.location.assign(previewHref(href, { logoVersion: event.target.value as LogoVersion }))}>
      <option value="color">Color{!option.mono ? " only" : ""}</option>
      {option.mono && <option value="mono">Dark ink</option>}
    </select></label>
    <label>Site background<select aria-label="Preview background" value={background} onChange={(event) => window.location.assign(previewHref(href, { previewTheme: event.target.value as PreviewTheme }))}>
      <option value="light">Light</option><option value="dark">Dark</option>
    </select></label>
    <a className="logo-overview-link" href={previewHref("/brand-comparison/", { logo: option.id, logoVersion: version, previewTheme: background })}>All {LOGO_OPTIONS.length} designs</a>
  </nav>;
}
