> Added October 19, 2026 as a source for the [action catalog](../action-catalog.md); rewritten October 20 to carry the post's own examples. Evidence label: **practitioner**. Rob Hoffman (@RobHoffman_ on X), a post of October 19, 2026, with a screenshot of Meta's assistant, Muse, recommending his client's product and steering the user to sign up. One client, one assistant. The post's address is not saved here yet.

# Making a site the answer an AI assistant gives

## What happened

A user asked Muse which newsletter platform to use and told it to choose one.
Muse answered in one word, the client's product, then "Done deliberating."
It gave one checkable reason, the client keeps 0% of subscription revenue
where the main rival takes 10%, named the growth tools, said the free plan
covers 2,500 subscribers, and offered to set the account up: name, domain,
welcome email, first issues. Hoffman's annotations on the screenshot:
"Recommending our client" and "Subtly shit-talking competitors."

That is the whole point of the lesson. The assistant did not list options; it
picked one, repeated a fact from the client's own page, compared it with the
rival on that fact, and moved the user to action. The eleven steps below are
how he says the client's site earned that. He calls it the future of AEO:
being the recommendation, not a result.

## The eleven steps, with his examples

1. **Fix the accessibility tree.** "This is literally how Muse reads your
   website." Four things: name every icon button, so the three-line menu
   button carries `aria-label="Open menu"`; give every form field a `<label>`
   with a plain name such as "phone", "first name", "email"; give every image
   alt text written as if explaining it to a blind person, his example being
   an overhead view of a white horse running; and put no important context in
   images. Everything must be machine-readable.
2. **Put key facts in the raw HTML.** Good: a paragraph that says the plans
   take 0% of paid subscription revenue. Bad: an empty `<div id="price">`
   filled in by a `<script>` after load. If pricing, proof or specs arrive by
   script, AI crawlers cannot read them.
3. **Make the first H2 the reader's main question.** Right below the H1, in
   plain English, worded as the reader would type it. His example is for a
   "[Competitor] vs [Competitor]" page: "Which is better, [Competitor 1] or
   [Competitor 2]?"
4. **Then an "it depends" answer in 100 words or less.** Don't say your product
   is best for everything; AI crawlers favour a page that recommends the best
   product for each specific case. His example: if keeping all your
   subscription revenue matters, the client is the better choice (0% against
   10%); the rival works if you want a built-in network to find readers and
   monetizing isn't the concern. Note that the answer names the rival and says
   when the rival wins; that is the sentence Muse repeated.
5. **Replace brand slogans with clear definitions.** Humans and crawlers are
   equally confused by lines like "Your inbox, reimagined", "Supercharge your
   CRM" or "The all-in-one social growth platform". Write instead what it is,
   who it's for and what it does: his example is a CRM for SEO agencies that
   tracks leads, proposals and existing clients on one dashboard.
6. **Add testimonials as plain text,** not images or JavaScript. The quick
   test: highlight the text with your mouse; if you can't, AI likely can't
   read it.
7. **Date every key fact with an "as of" statement:** pricing, features, G2
   ratings, number of users. His example: a competitor has 13,231 active
   subscribers, as of 2026.
8. **Allow Meta's crawler in robots.txt:** `User-agent: meta-webindexer` and
   `Allow: /`. Check your file at `[domain]/robots.txt`.
9. **Fix the broken links.** Run Screaming Frog (he has no affiliation); it
   audits the site and gives a spreadsheet of broken links; update, redirect or
   remove each. Broken links stop AI crawlers from exploring the site and
   lower its "trust score".
10. **Use semantic HTML.** `<nav>` not `<div class="nav">`; `<header>` not
    `<div class="header">`; `<button>Book now</button>` not `<div>Book
    now</div>`. Wherever a `<div>` does the job of a button, a nav, a link or a
    header, assume an agent will struggle.
11. **Keep content fresh.** Agents are more likely to cite content that is new
    or recently updated; update every 30 to 90 days, and put both a
    "published [date]" and an "updated [date]" line at the top of the page,
    below the byline.

He closes by offering live demos of sites ranking in Muse.

## How it reads for a plumber

The post sells software, but the shape transfers whole. The "[A] vs [B]" page
is the city hub's comparison: Dr Plumbing against the firms MapPack's scans
show at the top of that city, on facts a reader can check on their sites, and
saying when they are the better call. The "it depends" answer is "repair or
replace", "tank or tankless", "snake or hydro jet", with the owner's own
rule for each. The key facts to date are hours, service areas, the license,
years in the trade and the four differences; prices stay "a flat-rate price
before work starts", since nobody in the area publishes prices. Testimonials
are the Google reviews as text. The assistant named is Muse, so the result is
claimed for it; the steps are the same ones Google's own guidance gives for
pages it can understand ([Effective AEO report](effective-aeo.md)). One action
in the catalog, `make-site-agent-readable`, carries all eleven.
