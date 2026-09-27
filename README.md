# DrPlumbing

React and TypeScript website starter built with Vite. This is a local setup
screen, not the finished website. Claude owns the design work.

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

## Continue the website

- `src/App.tsx`: replace the setup screen with the approved design.
- `src/index.css`: replace the basic styles as the design develops.
- `src/App.test.tsx`: update the executable component examples with the design.
- `index.html`: update metadata and remove `noindex, nofollow` only for launch.

`CLAUDE.md` holds the shared agent instructions. `AGENTS.md` links to it.
See [project context](../PROJECT_CONTEXT.md) for software decisions and source links.

## Hosting

The build can be served as static files on Cloudflare. No Cloudflare account,
remote repository, deployment, domain, or contact-form service is configured.
Choose and test those before launch. Never place API secrets in browser code.
