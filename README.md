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

## Publish: preview to production

Cloudflare Pages is connected to this GitHub repository. It runs `npm run build`
and serves `dist/`. Confirm that **main** is the production branch under
**Workers & Pages > [project] > Settings > Builds > Branch control**.

1. Run `npm run build` and review the site locally. Commit the change on a branch and push it:

   ```sh
   git push -u origin HEAD
   ```

2. In **Workers & Pages > [project] > Deployments**, open that branch's preview
   URL. Check the desktop and mobile pages, links, and form. A real form test
   sends an email to the business inbox; coordinate it with the owner.
3. Open a GitHub pull request from the preview branch into `main`. Merge it
   after approval. Cloudflare builds `main` and updates
   `https://drplumbingheating.com/` automatically.
4. Check the production deployment status and live site in Cloudflare. If the
   build fails, read its deployment log before making another change.

If the preview URL does not appear, check **Branch control**: automatic preview
deployments must include your branch. Git-connected deployment needs no API key.
Never place API secrets in browser code. See
[Cloudflare's Git integration guide](https://developers.cloudflare.com/pages/configuration/git-integration/)
for branch and deployment controls.

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
