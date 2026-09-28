import { useEffect, useRef, useState } from "react";
import HomePage from "./HomePage";
import ServicesPage from "./ServicesPage";
import AboutPage from "./AboutPage";
import WorkPage from "./WorkPage";
import BookingPage from "./BookingPage";
import AreasPage from "./AreasPage";
import { ServicePage } from "./SiteContent";
import SiteShell from "./SiteShell";
import { SERVICES } from "./content";
import { HOME_ANCHORS, isLegacyRouteHash, routeFromLocation } from "./routes";
import { serviceDetailFor } from "./serviceDetails";
import { routeHref } from "./sitePaths";
import { updateHead } from "./seo";

/**
 * Description: Converts the clickable HTML reference into native pages with browser-history navigation.
 * Inputs: initialRoute selects a static build page; browsers resolve the URL path and legacy hash.
 * Output: One visible page, shared navigation, and live callback-request flow.
 * Examples: App.test.tsx navigates every page, an unknown route, and service-to-book selection.
 */
export default function App({ initialRoute }: { initialRoute?: string } = {}) {
  const [navigation, setNavigation] = useState(() => {
    const route = initialRoute ?? (typeof window === "undefined" ? "home" :
      routeFromLocation(window.location.pathname, window.location.hash));
    return {
      route,
      anchor: typeof window === "undefined" ? "" : window.location.hash.slice(1),
      bookingService: SERVICES.find((item) => item.id === route.split("/")[0])?.tab,
    };
  });
  const { route, anchor, bookingService } = navigation;
  const [serviceId, detailKey] = route.split("/");
  const service = SERVICES.find((item) => item.id === serviceId);
  const detail = service && detailKey ? serviceDetailFor(service.id, detailKey) : undefined;
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const updateRoute = () => {
      const nextRoute = routeFromLocation(window.location.pathname, window.location.hash);
      if (isLegacyRouteHash(window.location.hash)) {
        const canonicalPath = routeHref(nextRoute);
        // Old shared hash links still work, but the address bar now uses the public path.
        window.history.replaceState(null, "", `${canonicalPath.split("#")[0]}${window.location.search}${canonicalPath.includes("#") ? `#${canonicalPath.split("#")[1]}` : ""}`);
      }
      setNavigation((previous) => ({
        route: nextRoute,
        anchor: window.location.hash.slice(1),
        bookingService:
          SERVICES.find((item) => item.id === nextRoute.split("/")[0])?.tab ??
          previous.bookingService,
      }));
    };
    const followPageLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") || link.getAttribute("href") === "#main") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.href === window.location.href || routeFromLocation(url.pathname, url.hash) === "not-found") return;
      event.preventDefault();
      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      updateRoute();
    };
    updateRoute();
    document.addEventListener("click", followPageLink);
    window.addEventListener("popstate", updateRoute);
    window.addEventListener("hashchange", updateRoute);
    return () => {
      document.removeEventListener("click", followPageLink);
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("hashchange", updateRoute);
    };
  }, []);

  useEffect(() => {
    updateHead(route);
    const targetId = HOME_ANCHORS.includes(route) ? route : anchor;
    if (targetId) {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      const heading = target?.querySelector<HTMLElement>("h2, h3");
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
  }, [route, anchor]);

  return (
    <SiteShell route={route}>
      <main id="main" ref={mainRef} tabIndex={-1}>
        {service ? (
          <ServicePage service={service} detail={detail} />
        ) : route === "services" ? (
          <ServicesPage />
        ) : route === "about" ? (
          <AboutPage />
        ) : route === "work" ? (
          <WorkPage />
        ) : route === "book" ? (
          <BookingPage service={bookingService} />
        ) : route === "areas" ? (
          <AreasPage />
        ) : route === "not-found" ? (
          <section className="block wrap">
            <h1 tabIndex={-1}>Page not found.</h1>
            <p className="lead">Find the service you need or return to the homepage.</p>
            <a className="btn btn-primary" href={routeHref("services")}>Find your service</a>
          </section>
        ) : (
          <HomePage />
        )}
      </main>
    </SiteShell>
  );
}
