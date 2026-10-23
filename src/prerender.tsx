import { createElement, Fragment } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import App from "./App";
import { headTags } from "./seo";

export { PUBLIC_ROUTES, SITE_ORIGIN } from "./seo";
export { FULL_SERVICE_CITY_SLUGS, PATH_REDIRECTS, routeHref } from "./sitePaths";
export { PHOTOS } from "./projectPhotos";
export { PAGE_DATES } from "./pageDates";
export { AGENT_READABLE_CITY_SLUGS } from "./cities";
export { fillCity } from "./agentReadable";
export { SERVICE_ANSWERS } from "./content/serviceAnswers";

/**
 * Description: Renders the existing React page and its metadata for a static Cloudflare response.
 * Inputs: route is a public page ID or not-found; indexable is false for preview-only builds.
 * Output: HTML body and head fragments. React errors stop the build instead of publishing an empty page.
 * Examples: "plumbing" includes its service descriptions before JavaScript runs; "not-found" emits noindex metadata.
 */
export function renderPage(route: string, indexable = true) {
  const tags = headTags(route, indexable).map(({ tag, attributes, text }, index) =>
    createElement(tag, { key: index, "data-seo": "", ...attributes }, text),
  );
  return {
    head: renderToStaticMarkup(createElement(Fragment, null, ...tags)),
    body: renderToString(<App initialRoute={route} />),
  };
}
