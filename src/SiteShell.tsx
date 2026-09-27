import { useEffect, useRef, useState, type ReactNode } from "react";
import { SERVICES } from "./content";
import { Arrow } from "./SiteContent";

const pageLinks = [
  ["work", "Our Work"],
  ["about", "About"],
  ["home-reviews", "Reviews"],
  ["home-area", "Service Area"],
];

/**
 * Description: Provides the shared brand, responsive navigation, theme, and draft disclosure.
 * Inputs: route is the active hash destination; children is the current page.
 * Output: Header, accessible menus, page content, footer, and mobile contact links.
 * Examples: App.test.tsx opens and dismisses menus, follows links, and changes the saved theme.
 */
export default function SiteShell({
  route,
  children,
}: {
  route: string;
  children: ReactNode;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTop, setDrawerTop] = useState(68);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("dr-plumbing-theme");
      return saved === "dark" || saved === "light" ? saved : "system";
    } catch {
      return "system";
    }
  });
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const serviceActive =
    route === "services" || SERVICES.some((service) => service.id === route);

  useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("dr-plumbing-theme", theme);
    } catch {
      /* Private browsing may disable storage; the current theme still works. */
    }
  }, [theme]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  useEffect(() => {
    const dismissOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node))
        setDropdownOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dropdownOpen) {
          setDropdownOpen(false);
          dropButtonRef.current?.focus();
        }
        if (drawerOpen) {
          setDrawerOpen(false);
          menuButtonRef.current?.focus();
        }
      }
      if (event.key === "Tab" && drawerOpen) {
        const links = Array.from(
          drawerRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
            [],
        );
        const first = menuButtonRef.current;
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const closeMenus = () => {
      setDrawerOpen(false);
      setDropdownOpen(false);
    };
    document.addEventListener("click", dismissOutside);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("hashchange", closeMenus);
    window.addEventListener("resize", closeMenus);
    return () => {
      document.removeEventListener("click", dismissOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("hashchange", closeMenus);
      window.removeEventListener("resize", closeMenus);
    };
  }, [dropdownOpen, drawerOpen]);

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="review-note">
        Design preview · Business claims, reviews, and service areas await owner
        approval. Booking sends nothing.
      </aside>
      <div className="topbar">
        <div className="wrap">
          <span>
            Locally owned in <b>Newcastle, WA</b> · Serving homes from Everett
            to Kent
          </span>
          <span className="t-right">
            Licensed &amp; insured · Flat-rate pricing
          </span>
        </div>
      </div>
      <header
        className="site-header"
        ref={headerRef}
        onClick={(event) => {
          if ((event.target as Element).closest('a[href^="#"]')) {
            setDropdownOpen(false);
            setDrawerOpen(false);
          }
        }}
      >
        <div className="wrap">
          <a
            className="logo"
            href="#home"
            aria-label="Dr Plumbing and Heating, home"
            tabIndex={drawerOpen ? -1 : undefined}
          >
            <span className="mark">
              D<span>R</span>
            </span>
            <span className="words">PLUMBING &amp; HEATING</span>
          </a>
          <nav className="main-nav" aria-label="Main">
            <div
              className={`nav-drop${serviceActive ? " is-current" : ""}`}
              ref={dropdownRef}
            >
              <button
                type="button"
                ref={dropButtonRef}
                aria-expanded={dropdownOpen}
                aria-controls="dropPanel"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Services{" "}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="drop-panel" id="dropPanel" hidden={!dropdownOpen}>
                {SERVICES.map((service) => (
                  <a href={`#${service.id}`} key={service.id}>
                    <b>{service.tab}</b>
                    <span>{service.short}</span>
                  </a>
                ))}
                <a className="all" href="#services">
                  All services <Arrow />
                </a>
              </div>
            </div>
            {pageLinks.map(([id, label]) => (
              <a
                href={`#${id}`}
                key={id}
                aria-current={route === id ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="btn btn-outline" href="tel:2066718888">
              (206) 671-8888
            </a>
            <a className="btn btn-primary" href="#book">
              Book a visit
            </a>
            <a
              className="call-icon"
              href="tel:2066718888"
              aria-label="Call (206) 671-8888"
              tabIndex={drawerOpen ? -1 : undefined}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-btn"
              aria-expanded={drawerOpen}
              aria-controls="drawer"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                setDrawerTop(
                  headerRef.current?.getBoundingClientRect().bottom ?? 68,
                );
                setDrawerOpen(!drawerOpen);
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path
                  d={
                    drawerOpen
                      ? "M6 6l12 12M18 6L6 18"
                      : "M4 7h16M4 12h16M4 17h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <nav
        className="drawer"
        id="drawer"
        aria-label="Mobile"
        ref={drawerRef}
        hidden={!drawerOpen}
        style={{ top: drawerTop }}
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setDrawerOpen(false);
        }}
      >
        <h2>What do you need help with?</h2>
        <div className="drawer-list">
          {SERVICES.map((service) => (
            <a href={`#${service.id}`} key={service.id}>
              <span>
                <b>{service.tab}</b>
                <small>{service.short}</small>
              </span>
              <Arrow />
            </a>
          ))}
        </div>
        <div className="drawer-pages">
          <a href="#about">About us</a>
          <a href="#work">Our work</a>
          <a href="#services">All services</a>
          <a href="#book">Book a visit</a>
          <a href="#home-reviews">Reviews</a>
          <a href="#home-area">Service area</a>
        </div>
        <div className="drawer-phone">
          <span className="muted">Call us</span>
          <a href="tel:2066718888">
            <b>(206) 671-8888</b>
          </a>
        </div>
      </nav>
      <div inert={drawerOpen}>
        {children}
        <footer className="site-footer">
          <div className="wrap">
            <div className="foot-grid">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <a
                  className="logo on-dark"
                  href="#home"
                  aria-label="Dr Plumbing and Heating, home"
                >
                  <span className="mark">
                    D<span>R</span>
                  </span>
                  <span className="words">PLUMBING &amp; HEATING</span>
                </a>
                <p>Family owned and run from Newcastle, Washington.</p>
              </div>
              <div>
                <h3>Services</h3>
                <ul>
                  {SERVICES.map((service) => (
                    <li key={service.id}>
                      <a href={`#${service.id}`}>{service.tab}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Company</h3>
                <ul>
                  {pageLinks.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{label}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#book">Book a visit</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3>Contact</h3>
                <ul>
                  <li
                    style={{
                      color: "var(--band-ink)",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    <a href="tel:2066718888">(206) 671-8888</a>
                  </li>
                  <li>[EMAIL]</li>
                  <li>[HOURS]</li>
                  <li>WA Contractor Lic. [LICENSE #]</li>
                </ul>
              </div>
            </div>
            <div className="foot-base">
              <span>© 2026 Dr Plumbing &amp; Heating LLC</span>
              <label className="theme-control">
                Appearance{" "}
                <select
                  aria-label="Appearance"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value)}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <span>
                Licensed · Bonded · Insured{" "}
                <span className="draft-label">[Confirm]</span>
              </span>
            </div>
          </div>
        </footer>
        <nav className="action-bar" aria-label="Quick actions">
          <a className="btn btn-outline" href="tel:2066718888">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
            Call
          </a>
          <a className="btn btn-primary" href="#book">
            Book a visit
          </a>
        </nav>
      </div>
    </>
  );
}
