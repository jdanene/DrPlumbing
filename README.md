# DrPlumbing

React and TypeScript website built with Vite. The public build remains a draft
until the owner approves the business details and launch copy.

## Run locally

Use the Node version in `.node-version`. On Jide's Mac, Homebrew supplies Node 24
through the login-shell PATH. Open a new terminal after installation.

```sh
cd /Users/jideanene/claude/Projects/Plumbing/DrPlumbing
npm ci
npm run dev
```

Open the local address printed by Vite.

## Check and build

```sh
npm run check
npm run preview
```

`check` runs Oxlint, component smoke tests, TypeScript checks, and a production
build. Vite writes the static site to `dist/`; `preview` serves that build locally.

## Design mockup

`design/mockups/v1/dr-plumbing-preview.html` is the latest clickable mockup and
the design reference. Open it in a browser. See [design/README.md](design/README.md).

## Before launch

- Replace every bracketed placeholder with an owner-approved fact.
- Configure Cloudflare Email Service for the booking form as described below.
- Replace sample projects and reviews with verified material.
- Remove `noindex, nofollow` from `index.html` only after approval.

`CLAUDE.md` holds the shared agent instructions. `AGENTS.md` links to it.
See [project context](../PROJECT_CONTEXT.md) for software decisions and source links.

## Hosting

Cloudflare Pages builds the site with `npm run build` and serves `dist`.
Git-connected deployment needs no API key. Never place API secrets in browser
code.

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

Complete these Cloudflare dashboard steps before testing real delivery:

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
