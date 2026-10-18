# DrPlumbing

React and TypeScript website built with Vite. The build prerenders each page as
static HTML for Cloudflare Pages. React supplies the menus, filters, and form.

## View locally

Use the Node version in `.node-version`. On Jide's Mac, Homebrew supplies Node 24
through the login-shell PATH. Open a new terminal after installation.

```sh
cd /Users/jideanene/claude/Projects/Plumbing/DrPlumbing
npm ci
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173/`. Edits appear after
you save a file. Stop the server with `Ctrl-C`.

## Check and build

```sh
npm run build
npm run preview
```

`build` checks TypeScript and writes the complete static site to `dist/`.
`preview` serves that build at the address it prints. Neither command runs tests.
The optional `npm run check` also runs Oxlint and automated tests.

The static publisher copies shared public assets and the job photographs listed
in `src/projectPhotos.ts`. Camera originals, unused candidates and the GBP review
package stay out of `dist/`. Local Vite still serves the full review library.
Originals remain on disk and are excluded from Git; reviewed copies and their
classification records are versioned.

Local Vite servers do not run Cloudflare Pages Functions or apply Cloudflare's
`_headers` and `_redirects`. Check contact-email delivery and redirect/header
rules on a Cloudflare preview deployment.

## Design mockup

The clickable mockups live in `design/mockups/`. See
[design/README.md](design/README.md) for the design reference.

## Before launch

- Confirm any remaining bracketed facts with the owner.
- Test contact-email delivery with the owner.
- Add owner-supplied project photos. Keep sourced reviews and service areas.
- Check the production HTML and response headers permit indexing. Preview
  deployments must remain `noindex`.

`CLAUDE.md` holds the shared agent instructions. `AGENTS.md` links to it.
See [project context](../PROJECT_CONTEXT.md) for software decisions and source links.

## Publish to production (Cloudflare Pages)

The site is the Cloudflare Pages project **drplumbing**. Cloudflare is connected
to this GitHub repository: it runs `npm run build` on every pushed branch and
serves `dist/`. The production branch is `main`, served at
`https://drplumbingheating.com/`. **A merge to `main` is a publish.** The owner
merges; agents never push `main`. There is no deploy command and no button.

### The sequence

1. **Branch and check.** Work on a branch. Run `npm run check` (lint, tests,
   build) before pushing.
2. **Push.** `git push -u origin HEAD`. Cloudflare builds the branch and
   serves a preview, usually within three minutes.
3. **Look at the preview.** Check the desktop and mobile pages, links, and the
   form. A real form test sends an email to the business inbox; coordinate it
   with the owner. Previews are `noindex` and send no analytics.
4. **Open a pull request** into `main`. The Cloudflare bot comments the preview
   address on it and updates the comment on every push.
5. **The owner merges.** Cloudflare builds `main` and swaps the live site to
   it, usually within three minutes. Watch it under **Workers & Pages >
   drplumbing > Deployments**; a failed build is marked there, and its log says
   why.
6. **Verify live.** Open `https://drplumbingheating.com/`, check the change,
   tap **Call**, and watch GA4 Realtime for `call_click` (see Analytics).

### Where to see a preview

- **On the pull request:** the Cloudflare bot's comment, with "Deploy
  successful!" and two addresses.
- **Branch preview:** `https://<branch>.drplumbing.pages.dev` (slashes in the
  branch name become hyphens). Always the latest commit on the branch.
- **Per commit:** `https://<hash>.drplumbing.pages.dev`. Each build keeps its
  own address, so an old one stays viewable.
- **In Cloudflare:** **Workers & Pages > drplumbing > Deployments** lists every
  build, preview and production, with its commit, time, status and log.

Any pushed branch gets a preview; a pull request is not required. The free plan
allows 500 builds a month, one per push.

### What records a deploy

- **Git:** `git log --first-parent main` lists one merge commit per release,
  with its pull request number.
- **Cloudflare:** the Deployments list is the record of what the live site
  actually ran, including rollbacks, which Git does not see.

Nothing notifies anyone. Releases have no version numbers or tags; the history
is the Git log of `main` and the Deployments list. Tagging `main` after each
merge, as the MapPack admin site does, is a small addition if a second person
ever needs to read the history.

### Roll back

Two ways; prefer the first, because it keeps Git and the site in step.

- **Revert in Git.** On a branch, `git revert -m 1 <merge commit>`, push, open a
  pull request, merge. Cloudflare publishes the revert like any other merge.
- **Rollback in Cloudflare.** Under **Deployments**, open the last good
  production deployment and choose **Rollback to this deployment**. The site
  changes at once, but `main` still holds the bad commit; follow with the Git
  revert or the next merge republishes it.

Neither touches the contact-email Worker, which deploys separately with
`wrangler` (see Contact email).

If a preview address does not appear, check **Settings > Builds > Branch
control**: preview deployments must include your branch. Git-connected
deployment needs no API key. Never place API secrets in browser code. See
[Cloudflare's Git integration guide](https://developers.cloudflare.com/pages/configuration/git-integration/).

## Search indexing and page addresses

`npm run build` creates a page for every main route, service category and
service detail in the catalog. Each response contains the page's
full content, title, description, canonical URL, social tags, and business
schema before JavaScript runs. Service pages also include service and breadcrumb
schema. Business facts come from the current site; no review count, street
address, hours, or coordinates are invented.

For example, `/water-heaters/gas-water-heaters/` is a real page. Navigation still
accepts old links such as `/#water-heaters/gas-water-heaters`, then updates the
address bar. Homepage anchors such as `/#home-faq` and service section anchors
stay supported. Unknown paths receive Cloudflare's 404 response instead of a
homepage with a success status.

City pages come from `src/cities.ts`. Mercer Island is the full service-journey test:
`/plumber-mercer-island/` links to dedicated plumbing, water-heater replacement,
drain and sewer, filtration, heating and cooling, and boiler pages. `CITY_PATHS`
in `src/sitePaths.ts` defines their flat public addresses. The former nested
addresses remain supported and receive 301 rules in the generated `_redirects`.
Other cities retain `/areas-we-serve/{city}/` addresses; only listed city-service
combinations generate pages. Mercer Island also has 35 option pages, such as
`/gas-water-heaters-mercer-island/` and `/boiler-repair-mercer-island/`.
`CITY_OPTION_PAGES` derives those pages from the existing service menus and
explanations. Header, mobile, footer and sibling service links retain Mercer
Island context. Other cities and site-wide navigation keep their existing behavior.
Mercer Island service pages reuse `ServicePage`, including the main page's photos,
galleries and educational sections. Only location wording and navigation differ.
Federal Way and Newcastle replicate this same 42-page journey. Their entry points are
`/federal-way-residential-plumber/` and `/plumber-newcastle/`. Federal Way's existing
water-heater category uses `/federal-way-water-heater-installation/`; its former
addresses redirect to the requested paths.
`FULL_SERVICE_CITY_SLUGS` in `src/sitePaths.ts` opts cities into the shared
paths and service catalog; `src/cities.ts` reuses Mercer Island's localized copy
with the selected city's name. Other cities keep their current behavior.
The production build includes 183 sitemap pages.

The reusable instructions are committed at
[`skills/drplumbing-city-pages/SKILL.md`](skills/drplumbing-city-pages/SKILL.md).
Use `$drplumbing-city-pages` to repeat this work for another requested city.

The build generates `/robots.txt` and `/sitemap.xml` for
`https://drplumbingheating.com`. Submit the sitemap through the owner's Search
Console after deployment; generating it does not submit it or guarantee ranking.

Development HTML remains `noindex`. The production build permits indexing on
the registered domain. Host-specific `_headers` rules block both `*.pages.dev`
and branch-preview URLs from indexing without blocking the registered domain.
For a preview on another public host, build with `SITE_NOINDEX=1 npm run build`.
Rebuild without that variable before promoting to production.

`_redirects` maps the legacy Wix paths to existing pages on this site. Moving
traffic from `mbphg.com` still requires redirects on the old domain; this code
does not control that account.

The URL map lives in `src/sitePaths.ts`; metadata lives in `src/seo.ts`; the
static publisher lives in `scripts/prerender.mjs`. We chose static rendering of
the existing React components over metadata-only client rendering: crawlers get
the complete page without waiting for JavaScript. No server or new framework is
required. Deploy only `dist/`; `dist-ssr/` is a build tool, not a server to host.

Service descriptions live in `src/content.ts` and `src/serviceDetails.ts`.
The latter preserves the approved mockup's detail pages and cites the owner's
original `mbphg.com` pages for added explanations. A detail whose title matches
a catalog option becomes that option's destination. Every detail enters the
static build and sitemap automatically; its summary supplies search metadata
unless `src/seo.ts` has a specific override.

## Brand assets by surface

Keep the transparent website lockup for the page header and footer. Shared links
and small icons use opaque light backgrounds so the black lettering stays visible
in light and dark apps. All variants use the approved DR mark.

| Surface | SVG source | Production export |
| --- | --- | --- |
| Link previews, including messages | `public/brand/dr-social-card-v2.svg` | `public/brand/dr-social-card-v2.png` (1200 × 630; full website logo) |
| Business logo in structured data | `public/brand/dr-brand-mark.svg` | `public/brand/dr-brand-mark.png` (512 × 512) |
| Browser and search icons | `public/brand/dr-brand-mark.svg` | `public/brand/dr-favicon-48.png` (48 × 48), `public/brand/dr-favicon-96.png` (96 × 96), `public/favicon.ico` (16, 32, 48) |
| iPhone home-screen icon | `public/brand/dr-brand-mark.svg` | `public/apple-touch-icon.png` (180 × 180) |

Export PNGs with an opaque `#F7F5F1` background. Keep the square SVG and its PNG
together in the shared assets folder. The social-card version appears in its URL;
increment it when replacing the image. Messaging apps control their own crops,
text display, and caches, so an old message may retain its old preview.

## Contact email

The browser posts to `/api/contact`. The Pages Function validates the request,
filters a honeypot, and calls a private Worker through the `CONTACT_EMAIL`
service binding. The Worker sends through Cloudflare's native `send_email`
binding. It keeps the recipient on the server and never logs customer details.

Two Cloudflare-native designs were considered:

1. Call Email Service's REST API from the Pages Function. This needs a persistent
   account API token in the Pages project.
2. Bind Pages to a private Worker that owns email delivery. This adds one small
   Worker and removes stored API credentials.

The site uses option 2. Cloudflare Pages does not support `send_email` directly,
but it supports a private service binding to a Worker that does. Sending to a
verified Email Routing destination is free on every Cloudflare plan.

Cloudflare email setup uses these parts. Confirm each part before testing real
delivery:

1. Enable Email Routing for `drplumbingheating.com` under
   **Compute > Email Service > Email Routing**.
2. Add `drplumbinggroup@gmail.com` under **Destination Addresses**. Open the
   verification message in Gmail and approve it.
3. Deploy `email-worker/wrangler.jsonc`. Its `CONTACT_INBOX` binding restricts
   delivery to `drplumbinggroup@gmail.com` and restricts the sender to
   `website@drplumbingheating.com`.
4. Deploy the Pages project. `wrangler.jsonc` binds `CONTACT_EMAIL` to the
   `drplumbing-contact-email` Worker.
5. Verify the form with a real submission only after the business owner approves
   sending a test message.

The Worker has no public route. The sender is `website@drplumbingheating.com`.
The server-owned recipient is `drplumbinggroup@gmail.com`.

## Analytics

The site sends page views and contact taps to Google Analytics 4 (GA4) through
MapPack's private `mappack-web-analytics` package. The package is installed from
the committed `vendor/mappack-web-analytics-0.1.0.tgz`, because Cloudflare clones
this repository alone and cannot read the private MapPack source.

What is counted: page views; taps on call, text, email, map and review links;
and three booking-form events, sent by the form itself: first input
(`book_start`), a failure with its reason (`book_failed`), and a request the
server accepted (`generate_lead`) with the service, city and urgency chosen.
Names, phone fields and messages are never passed. Phone-like link labels are
dropped too.

Events go to the GA4 property **Dr Plumbing & Heating website** through the
public Measurement ID in `src/analytics.ts` (recorded on JDA-242). Only
`drplumbingheating.com` and its `www` host send; previews and localhost send
nothing, so a test must be made on the live site.

### View the numbers

1. Open [Realtime](https://analytics.google.com/analytics/web/#/p558397245/reports/realtime)
   in the Google account that owns the property. A page view or a tap on the
   live site appears within a minute, with its event name and `link_text`.
2. Standard reports, under **Reports > Engagement > Events**, fill in 24 to 48
   hours later.
3. Service, city and urgency show in reports only once the custom dimensions
   exist on the property (the owner's step on JDA-242). The events still
   arrive and are stored in the meantime.

A quick live check: open `https://drplumbingheating.com/`, tap **Call**, and
watch Realtime for `call_click`. Nothing in MapPack reads this data yet;
JDA-217 is the ticket that will pull reports into MapPack.

### Add an event

Two kinds of event exist.

- **Link taps need no code.** Any `tel:`, `sms:` or `mailto:` link, any link to
  Google Maps, and any link with `data-track="reviews"` is counted by the
  package wherever it sits on the page.
- **Site events are a `track()` call.** Import `track` from
  `mappack-web-analytics` and call it where the site knows the fact, as
  `src/BookingPage.tsx` does:

  ```ts
  track("book_start");
  track("generate_lead", { service, city, urgency, page_path: "/book/" });
  track("book_failed", { reason: "network" });
  ```

  The event names and parameters are fixed by the package's types. Pass the
  select option's text as written; never free text. Test with `vi.mock` of the
  package, as `src/BookingPage.test.tsx` does, and keep test lines at or under
  the code lines they cover.

A new event name or parameter is three changes: the package in the MapPack
repository (`packages/web-analytics`), a new tarball in `vendor/` installed
with `npm install ./vendor/<file>.tgz`, and a GA4 custom dimension for any new
parameter so it shows in reports.

### Known limits

The server returns success for spam-trap submissions too, so those attempts
count as **requests sent**. This is JDA-244's accepted limitation until a
follow-on server acceptance contract. It is never a count of qualified leads,
delivered inbox messages or jobs.

The loader URL remains in the JavaScript bundle because the tag is injected at
runtime. Generated HTML contains no Google tag. Tests verify preview isolation;
the live Realtime check is the owner's task (JDA-245) once `main` deploys.

### Later: the published package

After a separate publishing security review passes and the owner publishes:
`npm install mappack-web-analytics@0.1.0`, then remove the vendor tarball in a PR.
Read the [MapPack source guide](https://github.com/jdanene/mappack/blob/project/web-analytics/docs/analytics/README.md)
or its [admin-only install guide](https://mappack-docs.web.app/#analytics/analytics).
