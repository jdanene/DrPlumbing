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
filters a honeypot, and calls Cloudflare Email Service. It keeps the recipient
and credentials on the server. It never logs customer details.

Two Cloudflare-native designs were considered:

1. Call Email Service's REST API from the Pages Function. This needs two Pages
   secrets and no second deployment.
2. Bind Pages to a separate Worker that owns email delivery. This isolates the
   mail transport but adds another service, binding, and deployment.

The site uses option 1 because it has the smaller operational interface.

Complete these Cloudflare dashboard steps before testing real delivery:

1. Onboard `drplumbingheating.com` in **Compute > Email Service > Email Sending**.
2. Verify `drplumbinggroup@gmail.com` as an Email Routing destination address.
3. Create an API token with the account's **Email Sending: Edit** permission.
4. In the Pages project's encrypted secrets, set `CF_ACCOUNT_ID` and
   `CF_EMAIL_API_TOKEN` for Production and Preview as needed.
5. Redeploy the site, then submit one test request.

The sender is `website@drplumbingheating.com`. The server-owned recipient is
`drplumbinggroup@gmail.com`.
