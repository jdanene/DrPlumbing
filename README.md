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

`design/mockups/dr-plumbing-site.html` is the clickable mock website and the
design reference. Open it in a browser. See [design/README.md](design/README.md).

## Before launch

- Replace every bracketed placeholder with an owner-approved fact.
- Connect the booking form to the chosen contact service.
- Replace sample projects and reviews with verified material.
- Remove `noindex, nofollow` from `index.html` only after approval.

`CLAUDE.md` holds the shared agent instructions. `AGENTS.md` links to it.
See [project context](../PROJECT_CONTEXT.md) for software decisions and source links.

## Hosting

Cloudflare Pages builds the site with `npm run build` and serves `dist`.
Git-connected deployment needs no API key. Never place API secrets in browser
code.
