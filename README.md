# DrPlumbing

React and TypeScript website built with Vite. The public build remains a draft
until the owner approves the business details and launch copy.

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
npm run check
npm run preview
```

`check` runs Oxlint, component smoke tests, TypeScript checks, and a production
build. Vite writes the static site to `dist/`; `preview` serves that build at the
address it prints. Local Vite servers do not run Cloudflare Pages Functions, so
test contact-email delivery on a Cloudflare preview deployment.

## Design mockup

The clickable mockups live in `design/mockups/`. See
[design/README.md](design/README.md) for the design reference.

## Before launch

- Confirm any remaining bracketed facts with the owner.
- Test contact-email delivery with the owner.
- Add owner-supplied project photos. Keep sourced reviews and service areas.
- Remove `noindex, nofollow` from `index.html` only after approval.

`CLAUDE.md` holds the shared agent instructions. `AGENTS.md` links to it.
See [project context](../PROJECT_CONTEXT.md) for software decisions and source links.

## Publish: preview to production

Cloudflare Pages is connected to this GitHub repository. It runs `npm run build`
and serves `dist/`. Confirm that **main** is the production branch under
**Workers & Pages > [project] > Settings > Builds > Branch control**.

1. Run `npm run check` locally. Commit the change on a branch and push it:

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
