import { useEffect, useRef, useState } from "react";
import HomePage from "./HomePage";
import ServicesPage from "./ServicesPage";
import AboutPage from "./AboutPage";
import WorkPage from "./WorkPage";
import BookingPage from "./BookingPage";
import { ServicePage } from "./SiteContent";
import SiteShell from "./SiteShell";
import { SERVICES } from "./content";
import { HOME_ANCHORS, resolveRoute } from "./routes";

/**
 * Description: Converts the clickable HTML reference into native pages with browser-history navigation.
 * Inputs: The location hash; no server or customer-data service is required.
 * Output: One visible page, shared navigation, draft warning, and demo booking flow.
 * Examples: App.test.tsx navigates every page, an unknown route, and service-to-book selection.
 */
export default function App() {
  const [navigation, setNavigation] = useState(() => {
    const route = resolveRoute(
      typeof window === "undefined" ? "" : window.location.hash,
    );
    return {
      route,
      bookingService: SERVICES.find((item) => item.id === route)?.tab,
    };
  });
  const { route, bookingService } = navigation;
  const service = SERVICES.find((item) => item.id === route);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const updateRoute = () => {
      const nextRoute = resolveRoute(window.location.hash);
      setNavigation((previous) => ({
        route: nextRoute,
        bookingService:
          SERVICES.find((item) => item.id === nextRoute)?.tab ??
          previous.bookingService,
      }));
    };
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  useEffect(() => {
    document.title = `${service?.title ?? (route === "home" || HOME_ANCHORS.includes(route) ? "Residential plumbing & heating" : route.charAt(0).toUpperCase() + route.slice(1))} — Dr Plumbing & Heating · Design preview`;
    if (HOME_ANCHORS.includes(route)) {
      const target = document.getElementById(route);
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      const heading = target?.querySelector<HTMLElement>("h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    } else {
      window.scrollTo(0, 0);
      if (!firstRender.current)
        mainRef.current?.querySelector("h1")?.focus({ preventScroll: true });
    }
    firstRender.current = false;
  }, [route, service]);

  return (
    <SiteShell route={route}>
      <main id="main" ref={mainRef} tabIndex={-1}>
        {service ? (
          <ServicePage service={service} />
        ) : route === "services" ? (
          <ServicesPage />
        ) : route === "about" ? (
          <AboutPage />
        ) : route === "work" ? (
          <WorkPage />
        ) : route === "book" ? (
          <BookingPage service={bookingService} />
        ) : (
          <HomePage />
        )}
      </main>
    </SiteShell>
  );
}
