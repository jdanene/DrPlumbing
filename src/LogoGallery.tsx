import { useEffect, useState } from "react";
import { LogoArtwork } from "./LogoPreview";
import { LOGO_OPTIONS, logoOptionFromSearch, logoVersionFromSearch, previewHref, previewThemeFromSearch, type LogoOption, type LogoVersion, type PreviewTheme } from "./logoPreviewOptions";
import "./logoGallery.css";

const GROUPS = [
  { id: "finalist", title: "The finalists", description: "Color and supplied dark-ink versions. Open a website preview to see each choice in place." },
  { id: "reference", title: "The first four", description: "The original references, with their supplied backgrounds and watermarks." },
  { id: "current", title: "The current logo", description: "The existing logo, included for comparison." },
] as const;

/**
 * Description: Shows one supplied design and opens it on the existing website.
 * Inputs: option comes from the shared catalog; theme selects the website background.
 * The incoming URL restores the selected design's supported artwork version.
 * Output: Artwork, supported version controls, and a link retaining both choices.
 * Examples: LogoGallery.test.tsx checks supported versions and preview destinations.
 */
function LogoCard({ option, theme }: { option: LogoOption; theme: PreviewTheme }) {
  const [version, setVersion] = useState<LogoVersion>(() =>
    logoOptionFromSearch(window.location.search)?.id === option.id
      ? logoVersionFromSearch(window.location.search, option)
      : "color",
  );
  const href = previewHref("/", { logo: option.id, logoVersion: version, previewTheme: theme });

  return <article className="gallery-card" aria-labelledby={`logo-${option.id}-name`}>
    <div className="gallery-artwork">
      <LogoArtwork option={option} version={version} />
    </div>
    <div className="gallery-card-heading">
      <span className="gallery-number">{option.id === "original" ? "Current" : option.id.padStart(2, "0")}</span>
      <h3 id={`logo-${option.id}-name`}>{option.name}</h3>
    </div>
    <div className="gallery-card-actions">
      {option.mono ? <fieldset className="gallery-choice gallery-artwork-choice">
        <legend>Logo artwork</legend>
        <div className="gallery-segments">
          <label>
            <input type="radio" name={`artwork-${option.id}`} value="color" checked={version === "color"} onChange={() => setVersion("color")} />
            <span>Color</span>
          </label>
          <label>
            <input type="radio" name={`artwork-${option.id}`} value="mono" checked={version === "mono"} onChange={() => setVersion("mono")} />
            <span>Dark ink</span>
          </label>
        </div>
      </fieldset> : <p className="gallery-color-only">Color artwork</p>}
      <a className="gallery-preview-link" href={href} aria-label={`View ${option.name} on the ${theme} website with ${version === "mono" ? "dark-ink" : "color"} artwork`}>
        View on website
      </a>
    </div>
  </article>;
}

/**
 * Description: Compares the supplied logo catalog without changing the live site.
 * Inputs: Optional previewTheme=dark in the page URL selects dark surroundings.
 * Output: Grouped artwork and website links; theme changes preserve the URL's other parts.
 * Examples: LogoGallery.test.tsx checks all 15 cards and theme history synchronization.
 */
export function LogoGallery() {
  const [theme, setTheme] = useState<PreviewTheme>(() =>
    previewThemeFromSearch(window.location.search),
  );
  useEffect(() => {
    const syncTheme = () => setTheme(previewThemeFromSearch(window.location.search));
    window.addEventListener("popstate", syncTheme);
    return () => window.removeEventListener("popstate", syncTheme);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.previewTheme = theme;
    window.history.replaceState(window.history.state, "", previewHref(window.location.href, { previewTheme: theme }));
  }, [theme]);

  const finalistCount = LOGO_OPTIONS.filter((option) => option.group === "finalist").length;
  const referenceCount = LOGO_OPTIONS.filter((option) => option.group === "reference").length;

  return <>
    <a className="gallery-skip" href="#logos">Skip to logos</a>
    <header className="gallery-header">
      <a href="/">Dr Plumbing &amp; Heating</a>
      <span>Logo comparison · Preview only</span>
    </header>
    <main className="gallery-main">
      <div className="gallery-intro">
        <h1>Compare the logos.</h1>
        <p className="gallery-lead">{finalistCount} finalists, the first {referenceCount} references, and the current logo. See each one on the full website, with its layout, photos, text, and contact options unchanged.</p>
        <p className="gallery-note">Production has not changed. These previews help you compare the artwork in context.</p>
      </div>
      <div className="gallery-toolbar">
        <div>
          <fieldset className="gallery-choice gallery-theme-choice" aria-describedby="gallery-theme-help">
            <legend>Website background</legend>
            <div className="gallery-segments">
              <label>
                <input type="radio" name="website-background" value="light" checked={theme === "light"} onChange={() => setTheme("light")} />
                <span>Light website</span>
              </label>
              <label>
                <input type="radio" name="website-background" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} />
                <span>Dark website</span>
              </label>
            </div>
          </fieldset>
          <p id="gallery-theme-help">Applies to every website preview. Dark ink is a separate artwork choice.</p>
        </div>
        <nav className="gallery-jumps" aria-label="Logo groups">
          {GROUPS.map((group) => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}
        </nav>
      </div>
      <div id="logos">
        {GROUPS.map((group) => {
          const options = LOGO_OPTIONS.filter((option) => option.group === group.id);
          return <section className="gallery-section" id={group.id} key={group.id} aria-labelledby={`${group.id}-heading`}>
            <div className="gallery-section-heading">
              <h2 id={`${group.id}-heading`}>{group.title} <span>{options.length}</span></h2>
              <p>{group.description}</p>
            </div>
            <div className="gallery-grid">
              {options.map((option) => <LogoCard key={option.id} option={option} theme={theme} />)}
            </div>
          </section>;
        })}
      </div>
      <footer className="gallery-footer">
        <p>All artwork retains its supplied colors and backgrounds.</p>
        <a href="#">Back to top</a>
      </footer>
    </main>
  </>;
}
