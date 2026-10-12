import "./logoPreview.css";
import { LOGO_OPTIONS } from "./logoPreviewOptions";

/**
 * Description: Presents an unchanged supplied mark with readable service wording.
 * Inputs: option is one of the four references; onDark selects footer text contrast.
 * Output: A visual lockup; this preview does not alter favicons or sharing metadata.
 * Examples: LogoPreview.test.tsx checks each reference in both header and footer.
 */
export function PreviewBrand({ option, onDark }: {
  option: typeof LOGO_OPTIONS[number]; onDark: boolean;
}) {
  return <span className={`preview-brand preview-brand-${option.id}${onDark ? " on-dark" : ""}`}>
    <span className="preview-brand-mark">
      <img src={`/brand/logo-options/option-${option.id}.jpeg`} alt={`Logo option ${option.id}`} width={option.width} height={option.height} />
    </span>
    <span className="preview-brand-words"><strong>PLUMBING</strong><span>HEATING &amp; COOLING</span></span>
  </span>;
}

/**
 * Description: Lets the owner compare all four choices on the same page.
 * Inputs: option is the current valid reference.
 * Output: Named navigation with direct shareable links and a visible preview notice.
 * Examples: LogoPreview.test.tsx checks choice-specific rendering and ordinary-site isolation.
 */
export function LogoComparisonBar({ option }: { option: typeof LOGO_OPTIONS[number] }) {
  const pathname = window.location.pathname;
  return <nav className="logo-comparison" aria-label="Logo comparison">
    <span><b>Logo {option.id}</b> · {option.name}<small>Preview only · supplied references</small></span>
    <div>{LOGO_OPTIONS.map((item) => <a key={item.id} href={`${pathname}?logo=${item.id}`} aria-label={`Preview logo ${item.id}: ${item.name}`} aria-current={option.id === item.id ? "page" : undefined}>{item.id}</a>)}</div>
    <a className="logo-overview-link" href="/brand-comparison/">All four</a>
  </nav>;
}
