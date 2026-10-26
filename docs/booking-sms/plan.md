# Plan: text the owner when a visit is booked

Scoped October 25, 2026, from Jidè's words: "Ability to send a text to [the
owner's mobile] when someone clicks Book a visit, with all the information. Use
the SMS we just got approved." Linear project: https://linear.app/jdanene39/project/drplumbing-text-the-owner-when-a-visit-is-booked-b184045c5553. Branch
`project/booking-sms`, cut from `origin/main` at `0ce70dd`.

## The answer

When a visitor presses **Send request** on `/book/`, the server will send two
notifications at once: the booking email it sends today, and a text to the
business owner's mobile from the approved AWS toll-free number. Each one works
when the other fails. The visitor sees "Request sent." when at least one got
through and the existing error message only when both failed. Nothing in the
browser changes.

The text goes to the business owner, not to the customer, so no customer
consent is involved (Jidè, October 25, 2026). Carrier opt-out still applies to
the owner's own phone: if he texts STOP to the number, AWS stops the texts.

"When someone clicks Book a visit" is read as "when the server accepts the
form", the same moment the email goes. A text on every visit to the form page
would fire on every page view, submitted or not.

## Terms

- **Pages Function.** Server code under `functions/` that Cloudflare runs next
  to the static site. `functions/api/contact.ts` is the one behind
  `/api/contact`.
- **Service binding.** A private link from one Cloudflare Worker to another,
  with no public address. `CONTACT_EMAIL` in `wrangler.jsonc` (lines 5–10)
  binds the Pages Function to the email Worker.
- **AWS End User Messaging SMS.** The AWS service that sends texts; its API
  still carries the old name Pinpoint SMS Voice v2.
- **Origination identity.** The number or sender a text comes from. Ours is a
  toll-free number.
- **Toll-free number** and **10DLC.** Two kinds of US business texting number.
  A toll-free number is an 8xx number registered through AWS's toll-free form.
  A 10DLC ("10-digit long code") is an ordinary local number registered
  through a campaign. We have a toll-free number, not a 10DLC.
- **SigV4.** AWS Signature Version 4: the signing scheme every AWS API request
  carries in its `Authorization` header, computed from the access key, the
  date, the region, the service and a hash of the request.
- **Message part** (also "segment"). A 140-byte slice of a text. A text longer
  than one part is split and billed per part.
- **Sandbox.** The state a new AWS SMS account starts in: texts go only to
  verified destination numbers, and spend is capped at $1 a month.

## What was found

### The approved SMS (read-only, October 25, 2026)

Commands run, with `--profile` in {`zen`, `mappack`} and `--region` in
{`us-west-2`, `us-east-2`, `us-east-1`, `us-west-1`}: `aws pinpoint-sms-voice-v2
describe-phone-numbers`, `describe-sender-ids`, `describe-pools`,
`describe-configuration-sets`, `describe-registrations`,
`describe-protect-configurations`, `describe-account-attributes`,
`describe-spend-limits`; then, where the number lives,
`describe-verified-destination-numbers`, `describe-opted-out-numbers`,
`describe-account-limits`, `describe-registration-versions` and
`describe-registration-field-values`. No key, secret or token was printed.

| Fact | Value |
| --- | --- |
| Where | the AWS account behind the `zen` CLI profile (no account alias set), region `us-west-2`. The `mappack` profile's account has no SMS resources in any of the four regions. |
| Number | `+1 855-771-3501`, id `phone-d2d175e381f14d48a070b3f3a92a2f13` |
| Type | `TOLL_FREE`, `TRANSACTIONAL`, capabilities SMS, MMS, VOICE; lease `$2.00` a month; created October 15, 2026 |
| Status | `ACTIVE` |
| Registration | `US_TOLL_FREE_REGISTRATION`, status `COMPLETE`; version 2 approved October 23, 2026; version 1 denied ("Inaccurate DBA Name", "Invalid Website URL") |
| Registered for | MapPack: use case `ACCOUNT_NOTIFICATIONS`, website `mappack-fabf1.web.app`, sample messages begin "MapPack:". Business type sole proprietor. |
| Two-way | `TwoWayEnabled: false`. Replies from the owner go nowhere; AWS still handles STOP and HELP (self-managed opt-outs off). |
| Account tier | `SANDBOX`. Verified destination numbers: 0 of 10. Monthly text spend limit: `$1.00` (enforced and maximum). |
| Opt-out list | `Default`, empty |
| Elsewhere | the `zen` account also has a configuration set `zen-tradez-sms` in `us-east-2` with no numbers; it is not this feature's. |

Two consequences for the build. First, in the sandbox a text to the owner
fails until his mobile is a verified destination or the account leaves the
sandbox ([AWS sandbox doc](https://docs.aws.amazon.com/sms-voice/latest/userguide/sandbox.html)).
Second, the registration is MapPack's, so the texts will arrive from a number
registered for MapPack notifications; Jidè decides whether that is what he
means (open question 1).

### What exists in the repo (audit 1)

`git grep -n -i -E "sms|text message|pinpoint|twilio|aws4fetch|aws-sdk|sigv4"
origin/main` finds no SMS sending and no AWS code. The only hits are the
`sms:+12066718888` "Text us" links (`src/BookingPage.tsx:121`, `:148`;
`src/SiteShell.tsx:254`, `:356`, `:478`; `src/HomePage.tsx:103`;
`src/SiteContent.tsx:70`) and `README.md:358` on counting taps of them. Those
are the customer texting the business; this plan is the business texting its
owner.

The booking path today, on `origin/main`:

1. `src/BookingPage.tsx` lines 48–107: validates name and phone with
   `validateBooking` (`src/booking.ts:11–23`), builds the summary rows Name,
   Phone, City, Service, How soon, Best time, Details (lines 66–74), POSTs
   JSON to `/api/contact` (78–92), and reads only `response.ok` (93). States
   `idle`, `sending`, `sent`, `error`; the button is disabled while sending
   (152); the error text is at line 153.
2. `functions/api/contact.ts`: same-origin, JSON and size checks (63–72),
   `parsePayload` with per-field caps (115–166; Details up to 2,000
   characters at 138), honeypot (76), form-timing check (78–81), server-side
   `validateBooking` (82–85), then one call to the `CONTACT_EMAIL` binding
   (90–105) with `contactMessage(payload)` (174–187) as the plain-text body.
   Responses: 200, 400, 403, 413, 415, 503 when the binding is missing (86–88),
   502 when the Worker fails (100–105). It never logs customer details
   (`README.md:289`).
3. `email-worker/src/index.ts`: the private Worker. Accepts `POST /send`
   with `{ subject, text }` (text up to 3,500 characters, line 81) and sends
   through the `send_email` binding to `drplumbinggroup@gmail.com` (line 1).
   It deploys by hand with `wrangler`, separately from the site
   (`README.md:139–140`).
4. Tests: `functions/api/contact.test.ts` (six cases), `email-worker/src/index.test.ts`
   (three), `src/BookingPage.test.tsx` (six). Runner: vitest
   (`package.json` `"test": "vitest run"`); `npm run check` runs lint, tests
   and build.
5. Business record: `src/businessFacts.ts` (phone `(206) 671-8888` /
   `+12066718888` at 165, email at 166, license `DRPLUPH740ND` at 167–175).
   Site origin: `src/seo.ts:9` `SITE_ORIGIN`.

The delta this plan adds: one module that sends a text, one fan-out in the
Pages Function, one README section, five Cloudflare secrets, one IAM user in
AWS. Nothing else.

## Design, twice

Jidè's rule for the pick: fewest moving parts, email keeps working when SMS
fails, SMS keeps working when email fails.

**A. The Pages Function fans out (chosen).** `functions/api/contact.ts` makes
two calls in parallel: the existing `CONTACT_EMAIL` binding and
`SendTextMessage` on AWS, signed with SigV4 and sent from the Function.
Interface change: the Function's environment gains five secrets; its response
gains two outcome fields. The email Worker is untouched. The code deploys with
the site on the merge to `main`, with no second deploy step. Cloudflare Pages
keeps production and preview settings apart, so previews, which have no
secrets, skip the text and only email, as they do today.

**B. The email Worker becomes a notify Worker.** The Worker sends the email
and the text. Interface change: the private `/send` contract must carry the
fields or a second body, and must answer with two outcomes instead of one; the
Function must read them. The Worker deploys by hand with `wrangler`
(`README.md:139–140`), so every change here is a second deploy. The Worker has
one environment, so every preview form test would text the owner. Same AWS
secrets, held by the Worker instead of the Pages project.

**C. A Lambda behind a function URL.** The Function or Worker calls a new AWS
Lambda that sends the text. Adds a runtime, a deployment the repo has no
tooling for, an IAM role, and authentication on the URL (IAM auth is SigV4
again, or a shared secret). Two network hops instead of one. Nothing gained
over A except keeping the AWS key inside AWS, at the price of a new service.

**D. Others ruled out.** Calling AWS from the browser: never; secrets would
be in the bundle (`README.md`, "Never place API secrets in browser code").
Amazon SNS `Publish`: a second AWS API with the same signing and less control
over the origination number. Cloudflare Queues: a paid-plan feature for a
one-message job. A carrier email-to-SMS gateway: unreliable and not the
approved SMS Jidè named.

A wins: one new module, no new service, no new deploy step, and the two
channels fail independently because they are two awaited calls in one
function. Its cost is an AWS access key stored in Cloudflare, scoped below to
one action on one number.

**Why not a separate email module too.** The email call is fifteen lines in
`contact.ts`. Moving it to its own file would make a module whose interface is
as large as its body (engineering ethos §3.3, shallow module). It becomes a
local function in `contact.ts` that returns an outcome word, nothing more.

## The contract

### The module (new, S1)

```ts
// functions/notify/ownerSms.ts
export interface OwnerSmsEnv {
  AWS_SMS_ACCESS_KEY_ID?: string;
  AWS_SMS_SECRET_ACCESS_KEY?: string;
  AWS_SMS_REGION?: string;               // "us-west-2"
  AWS_SMS_ORIGINATION_IDENTITY?: string; // the phone-number ARN
  SMS_OWNER_NUMBER?: string;             // E.164, "+1..."
}
export type SmsOutcome = "sent" | "skipped" | "failed";

// The text, from labelled lines, fitted to what a carrier accepts. Pure.
export function smsBody(firstLine: string, lines: readonly (readonly [string, string])[]): string;

// One SendTextMessage call. Never throws, never retries, never logs the body.
export function textOwner(body: string, env: OwnerSmsEnv, fetcher?: typeof fetch): Promise<SmsOutcome>;
```

`textOwner` returns `"skipped"` when any of the five values is missing,
`"sent"` on HTTP 200, and `"failed"` on anything else, including a timeout.
It logs one line per call with fixed words and, on failure, the AWS error
type and reason only (`booking sms failed: ConflictException
DESTINATION_PHONE_NUMBER_OPTED_OUT`). The message body never reaches a log.

The wire call, from the AWS CLI's own service model
(`botocore/data/pinpoint-sms-voice-v2/2022-03-31/service-2.json`: protocol
`json` 1.0, target prefix `PinpointSMSVoiceV2`, endpoint prefix `sms-voice`,
signing name `sms-voice`):

```
POST https://sms-voice.us-west-2.amazonaws.com/
Content-Type: application/x-amz-json-1.0
X-Amz-Target: PinpointSMSVoiceV2.SendTextMessage
Authorization: AWS4-HMAC-SHA256 Credential=<key id>/<date>/us-west-2/sms-voice/aws4_request, ...

{ "DestinationPhoneNumber": "<SMS_OWNER_NUMBER>",
  "OriginationIdentity": "<AWS_SMS_ORIGINATION_IDENTITY>",
  "MessageBody": "<body>",
  "MessageType": "TRANSACTIONAL",
  "MaxPrice": "0.15" }
```

Parameters and errors are from the
[SendTextMessage API reference](https://docs.aws.amazon.com/pinpoint/latest/apireference_smsvoicev2/API_SendTextMessage.html):
`MessageBody` is 1 to 1,600 characters; `MaxPrice` is "the maximum amount
that you want to spend, in US dollars, per each text message", and above it
"the message is not sent and an error is returned"; `DryRun: true` validates
without sending and "You are not charged for using DryRun". Every error is
HTTP 400 except `InternalServerException` (500): `AccessDeniedException`,
`ConflictException`, `ResourceNotFoundException`,
`ServiceQuotaExceededException`, `ThrottlingException`,
`ValidationException`. The reasons the module names in its log come from the
same model: `DESTINATION_PHONE_NUMBER_OPTED_OUT`,
`DESTINATION_PHONE_NUMBER_NOT_VERIFIED`, `RESOURCE_NOT_ACTIVE`,
`REGISTRATION_NOT_COMPLETE`, `MONTHLY_SPEND_LIMIT_REACHED_FOR_TEXT`,
`PRICE_OVER_THRESHOLD`.

Signing: [aws4fetch](https://github.com/mhart/aws4fetch) 1.0.20 (MIT, no
dependencies, 6.4 kB minified; runs on Cloudflare Workers with `fetch` and
`SubtleCrypto`). The module calls `aws.sign(request)` to get a signed
`Request`, then sends it once itself with `fetcher(signed, { signal:
AbortSignal.timeout(8_000) })`. It does not call `aws.fetch`, whose retries
default to 10; a paid send must not retry by itself. The dependency goes in
`package.json` `dependencies`; Pages bundles npm packages imported from
`functions/` ([Pages Plugins doc](https://developers.cloudflare.com/pages/functions/plugins/)
installs with `npm install` and imports inside `functions/`). A file under
`functions/` becomes a route only when it exports `onRequest*`
([wrangler `filepath-routing.ts`](https://github.com/cloudflare/workers-sdk/blob/wrangler%403.114.0/packages/wrangler/src/pages/functions/filepath-routing.ts),
regex `/^onRequest(Get|Post|Put|Patch|Delete|Options|Head)?$/`), so
`functions/notify/ownerSms.ts` is a module, not an endpoint.

### The endpoint (changed, S2)

`POST /api/contact` keeps every check it has. After validation it runs both
channels with `Promise.allSettled` and answers:

| Email | Text | Status | Body |
| --- | --- | --- | --- |
| sent | sent, failed or skipped | 200 | `{ "ok": true, "email": "sent", "sms": "<outcome>" }` |
| failed or skipped | sent | 200 | `{ "ok": true, "email": "<outcome>", "sms": "sent" }` |
| failed | failed | 502 | `{ "ok": false, "error": "Delivery failed. Try again.", "email": "failed", "sms": "failed" }` |
| skipped | skipped | 503 | `{ "ok": false, "error": "Delivery is not configured." }` |
| failed | skipped, or skipped and failed | 502 | as the 502 row, with the true outcomes |

Honeypot and timing rejections are unchanged and attempt neither channel.
The two new fields are additive; the browser reads `response.ok` only
(`src/BookingPage.tsx:93`), so no front-end change is needed or made. The
fields are the "visible notice" for a developer: in a preview or a local run
without secrets the response says `"sms": "skipped"`, and the Function logs
`booking sms skipped: not configured`. Logs are read in the Cloudflare
dashboard under the deployment's logs or with `npx wrangler pages deployment
tail --project-name drplumbing`.

### The text

Every form field, in the order the email uses (`contact.ts:174–187`), with the
same fallbacks, no blank lines, no emoji of our own:

```
New booking from drplumbingheating.com
Name: Taylor Reed
Phone: (206) 555-0123
City: Newcastle
Service: Water heaters
How soon: Today
Best time: Afternoon
Details: Water heater is leaking from the bottom.
```

The first line names the host the form was submitted on
(`new URL(request.url).hostname`), so it is true on any deployment without a
constant to keep in step. That example is 196 characters: two message parts.

Length. The API accepts 1,600 characters, but AWS says "The maximum supported
size of any message is 1530 GSM characters or 630 non-GSM characters"; a
longer message fails
([SMS character limits](https://docs.aws.amazon.com/sms-voice/latest/userguide/sms-limitations-character.html)).
A text is GSM when every character is in the GSM 03.38 set (ASCII letters,
digits, common punctuation, line feed, a few accented letters); one character
outside it (an emoji, a curly quote, an accent outside the set) makes the
whole text non-GSM, with 67 characters per part instead of 153. So `smsBody`:

1. normalizes the punctuation word processors and phones insert, which is
   outside the set and carries no meaning: curly quotes to `'` and `"`, en
   and em dashes to `-`, the ellipsis to `...`, non-breaking space to space;
2. keeps every other customer character as typed;
3. caps the whole text at 1,530 characters when it is GSM and 630 when it is
   not, by cutting the Details value only (every other field is bounded by
   `parsePayload`: at most about 450 characters together) and ending the cut
   value with ` [cut]`.

The full Details always reach the email (the Worker accepts 3,500
characters). Jidè's "under 1,600 characters" holds in every case.

## Credentials and permissions

**Where they live.** Five Cloudflare Pages secrets on the project
`drplumbing`, production environment only, set by Jidè with `npx wrangler
pages secret put <KEY> --project-name drplumbing`
([Wrangler Pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/))
or in the dashboard under Workers & Pages › drplumbing › Settings › Variables
and Secrets › Encrypt
([Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)).
Never in git: the repository is public, and `.gitignore` already excludes
`.dev.vars*` and `.env*`. The region is public knowledge and the origination
ARN merely contains the AWS account id, but both go in as secrets too, so one
mechanism and one set of commands cover all five and nothing about the
account enters a public file. `wrangler.jsonc` does not change.

| Secret | Value |
| --- | --- |
| `AWS_SMS_ACCESS_KEY_ID` | the IAM user's key id |
| `AWS_SMS_SECRET_ACCESS_KEY` | its secret |
| `AWS_SMS_REGION` | `us-west-2` |
| `AWS_SMS_ORIGINATION_IDENTITY` | `arn:aws:sms-voice:us-west-2:<ACCOUNT_ID>:phone-number/phone-d2d175e381f14d48a070b3f3a92a2f13` |
| `SMS_OWNER_NUMBER` | the owner's mobile in E.164 (Jidè has it; it is in the Linear project, not here) |

**The IAM policy.** A dedicated IAM user, `drplumbing-booking-sms`, with one
inline policy and one access key. The key is long-lived because Cloudflare
has no way to assume an AWS role; the policy makes it worth one thing:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "SendBookingText",
    "Effect": "Allow",
    "Action": "sms-voice:SendTextMessage",
    "Resource": "arn:aws:sms-voice:us-west-2:<ACCOUNT_ID>:phone-number/phone-d2d175e381f14d48a070b3f3a92a2f13"
  }]
}
```

AWS's own guidance on scoping this action: "If the permissions policy ...
scopes the sms-voice:SendTextMessage resource to a specific ARN, provide that
same ARN" as the `OriginationIdentity`
([Cognito SMS settings](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-sms-settings.html)).
The module passes the ARN, not the bare number, for that reason. S3's
`--dry-run` call proves the pair before anything merges, at no charge.

## Failures and the retry story

Rules, from Jidè (October 25, 2026) and `create-a-project` §5:

- An SMS send is a paid step. It never retries by itself: not aws4fetch (we
  sign and send once), not the Function, not the browser.
- A failed text is logged with its AWS error type and reason, never with
  customer data (`README.md:289`; `src/BookingPage.tsx:45`).
- The email still goes when the text fails, and the text still goes when the
  email fails. Each is one awaited call; neither waits on the other's result.
- The visitor sees the existing error state (`src/BookingPage.tsx:153`) only
  when both channels failed.
- A missing configuration skips the text with a visible notice (the `sms`
  field and the log line) and never crashes the request.

**Retry story.** Nothing here retries automatically. The only retries are
people: the visitor pressing Send request again after the error state, which
sends both channels again; and the owner or Jidè acting on a logged reason
(texting UNSTOP after a STOP, raising the spend cap, replacing a key). A
timeout after the request left (an unknown outcome) is logged as failed and
not re-sent; the email is the record. The email call is unchanged: one
attempt, as today.

## Edge-case index

| # | Case | Ticket |
| --- | --- | --- |
| 1 | A secret missing (local, preview, or lost in production) | S1-1, S2-10, S2-11 |
| 2 | AWS throttling (toll-free numbers send 3 parts a second) | S1-2 |
| 3 | The owner texted STOP (opted out) | S1-3, S3-5 |
| 4 | Destination not verified while in the sandbox | S1-4, S3-1 |
| 5 | Number pending, suspended, released, or its registration revoked | S1-5 |
| 6 | Monthly spend cap reached ($1 today) | S1-6, S3-6 |
| 7 | Price above `MaxPrice` | S1-7 |
| 8 | Text longer than a carrier accepts | S1-8 |
| 9 | Non-GSM characters in customer text | S1-9 |
| 10 | AWS slow or unreachable; the Function waiting | S1-10, S2-8 |
| 11 | Bad or rotated credentials | S1-11, S3-4, S3-7 |
| 12 | Duplicate submit | S1-13, S2-9 |
| 13 | Email fails, text succeeds, and the reverse | S2-4 to S2-7 |
| 14 | Neither channel configured | S2-3 |
| 15 | Honeypot or stale form | S2-1, S2-2 |
| 16 | Secrets set after the merge | S3-3 |

## Tickets

Tasks are tracked in the Linear project named at the top. Each ticket below is
the ticket's text. Sizes count files touched; none exceeds five (audit 6).
Conventions for every ticket: work in a worktree on a task branch cut from
`project/booking-sms`, merge back fast-forward, push the project branch; run
`npm run check` before handing off (`CLAUDE.md`); four-part headers on every
function, every header example a test (engineering ethos §5); Strunk and
White in headers, commits and the PR body; commits end with
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Ticket and PR
prose follow `mappack/.agents/skills/explain-clearly/SKILL.md`. Never push
`main` (`README.md:81–82`).

### S1 · The owner-text module: sign, send, say what happened

**Size M.** Files: `functions/notify/ownerSms.ts` (new),
`functions/notify/ownerSms.test.ts` (new), `package.json`, `package-lock.json`.
Waits on nothing.

**Build** the module in "The contract" above: `smsBody` and `textOwner`, the
`OwnerSmsEnv` type, aws4fetch 1.0.20 added as a dependency. `textOwner` signs
with `AwsClient.sign`, sends once through the given `fetcher` (default the
global `fetch`) with an 8-second `AbortSignal.timeout`, and maps the result
to an outcome word. Logging: `console.info("booking sms sent", messageId)`,
`console.warn("booking sms skipped: not configured")`,
`console.warn("booking sms failed: <ErrorType> <Reason>")`, or
`"booking sms failed: timeout"` / `"network"` / `"http <status>"` when AWS
returned no JSON error. The body is never logged or thrown.

**Reuse and refactor.** No signing or AWS code exists to reuse (audit 1). The
`[label, value][]` line shape is the one `src/BookingPage.tsx:66–74` and
`functions/api/contact.ts:174–187` already use, so S2 can feed both renderers
from one list. The narrow optional-field env type mirrors `ContactEnv`
(`contact.ts:5–9`) and `EmailWorkerEnv` (`email-worker/src/index.ts:14–16`).
`AbortSignal.timeout` and `console.warn` have precedents in
`scripts/check-links.mjs:66` and `:158`.

**Skills.** agent-skills `incremental-implementation`,
`test-driven-development`, `api-and-interface-design` (the two exports and
the five-secret env are the interface), `security-and-hardening` (a credential
and untrusted text pass through here); the repo's engineering ethos
(`/Users/jideanene/.codex/skills/engineering-ethos/SKILL.md`).

**Tests** (`functions/notify/ownerSms.test.ts`, vitest, test lines at or
under the module's code lines, both counts in the PR body, `README.md:373`):

1. `signs and posts one SendTextMessage, and does not retry`: a recording
   fetcher; one call; URL `https://sms-voice.us-west-2.amazonaws.com/`;
   header `x-amz-target` is `PinpointSMSVoiceV2.SendTextMessage`;
   `authorization` begins `AWS4-HMAC-SHA256 Credential=<key id>/`; body has
   `DestinationPhoneNumber`, `OriginationIdentity`, `MessageBody`,
   `MessageType: "TRANSACTIONAL"`, `MaxPrice: "0.15"`; result `"sent"`.
2. `a provider error is "failed", logged by type and reason, never by
   content`: a 400 with `{"__type":"ConflictException","Reason":
   "DESTINATION_PHONE_NUMBER_OPTED_OUT","Message":"..."}` gives `"failed"`;
   the warn line contains both words and not the body text; a rejected fetch
   also gives `"failed"`.
3. `missing configuration skips the send`: any one of the five absent gives
   `"skipped"`, the fetcher is not called, the warn line says `not configured`.
4. `smsBody` header examples, run in the same file: the typical case above;
   a 2,000-character Details gives a 1,530-character body ending `[cut]`;
   the same Details with one emoji gives 630 characters ending `[cut]`;
   `“Leaking”` becomes `"Leaking"`.

**Edge cases.**

1. Any of the five secrets missing: `"skipped"`, one warn line, no call.
2. `ThrottlingException`: `"failed"`, logged; no retry. A toll-free number
   sends 3 message parts a second
   ([MPS limits](https://docs.aws.amazon.com/sms-voice/latest/userguide/sms-limitations-mps.html));
   at this site's volume that needs four bookings in one second.
3. `ConflictException DESTINATION_PHONE_NUMBER_OPTED_OUT`: the owner texted
   STOP; every text fails until he texts UNSTOP or START, or Jidè runs
   `aws pinpoint-sms-voice-v2 delete-opted-out-number`. Email unaffected.
4. `ConflictException DESTINATION_PHONE_NUMBER_NOT_VERIFIED`: the account is
   in the sandbox and the owner's number is not verified. S3 step 1 prevents
   it; if it appears, S3 was skipped.
5. `ConflictException RESOURCE_NOT_ACTIVE` or `REGISTRATION_NOT_COMPLETE`,
   `ResourceNotFoundException`, or `AccessDeniedException` because the
   policy's ARN no longer names the number: `"failed"`, logged with type and
   reason. The number is `ACTIVE` today.
6. `ServiceQuotaExceededException MONTHLY_SPEND_LIMIT_REACHED_FOR_TEXT`:
   the $1 monthly cap; `"failed"` until the month turns; email unaffected.
7. `ValidationException PRICE_OVER_THRESHOLD`: a text priced above `MaxPrice`
   `0.15`; unreachable at today's price (ten parts cost $0.12) and harmless
   if reached.
8. Overflow: Details up to 2,000 characters (`contact.ts:138`); `smsBody`
   cuts it to fit 1,530 or 630 and marks the cut; the email has the whole.
9. Non-GSM characters: punctuation normalized; everything else kept; the cap
   drops to 630 and parts shorten to 67 characters.
10. AWS slow or unreachable: the 8-second timeout gives `"failed"` with
    reason `timeout`; the text may still arrive (unknown outcome); it is not
    re-sent. Pages Functions have no wall-clock limit and the signing costs
    far under the free plan's 10 ms CPU
    ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)).
11. Wrong key or secret: a 403 `InvalidSignatureException` or
    `UnrecognizedClientException` in the `__type` field, logged by type.
12. A non-JSON error body (an HTML 5xx from a proxy): `"failed"`, reason
    `http <status>`.
13. The same body sent twice because the visitor resubmitted: two texts. No
    dedupe store (decided; it would add a KV binding for a case the owner
    can see by eye).
14. A Worker clock more than 15 minutes off rejects SigV4; logged by type if
    it ever happens.

The edge cases above are the ones found before the build. Find the rest: for
every call, every write and every state, ask what happens when it is
missing, fails, repeats or races, and record each case you handle in the PR
body.

### S2 · `/api/contact` fans out to email and text; README

**Size M.** Files: `functions/api/contact.ts`, `functions/api/contact.test.ts`,
`README.md`. Waits on S1.

**Build**, as two commits. First the refactor, no behaviour change: extract
`bookingLines(payload): [string, string][]` from `contactMessage`
(`contact.ts:174–187`), and have `contactMessage` render those lines with its
blank lines as today; the six existing tests stay green. Then the feature:
after validation, call a local `emailOwner()` (the existing binding call,
lines 90–105, returning `"sent" | "failed" | "skipped"`) and
`textOwner(smsBody(`New booking from ${url.hostname}`, lines), env)` under
`Promise.allSettled`, and answer per the status table in "The contract".
Extend `ContactEnv` with `OwnerSmsEnv`. Log `booking email failed: <status |
network>` on an email failure, nothing on success. Then the README: a
"Booking text" subsection under Contact email that states what the text is,
where the five secrets live and their names, that previews and local runs
without secrets skip the text with `"sms": "skipped"`, how to run the Function
locally (`npx wrangler pages dev dist` with a git-ignored `.dev.vars`), the
account facts from "What was found", and the per-part price.

**Reuse and refactor.** The field order and fallbacks exist three times after
this ticket: the browser's summary (`src/BookingPage.tsx:66–74`), the email
and the text. The two server copies become one (`bookingLines`); the
browser copy stays, recorded here as accepted, because it is screen copy
rather than a transport format and changing it would open a front-end
ticket. `json()` (`contact.ts:205–214`) and `singleLine()` (`195–197`) are
reused for every new exit and every text line; `json()` also exists in the
email Worker (`email-worker/src/index.ts:96`), a separate deployable, which
is left alone.

**Skills.** agent-skills `incremental-implementation`,
`test-driven-development`, `api-and-interface-design` (the response
contract is additive and the browser must keep working unchanged); the
repo's engineering ethos. No front-end file changes; if one must, the
Impeccable plugin and agent-skills `frontend-ui-engineering` apply to it.

**Tests** (`functions/api/contact.test.ts`; stub the global `fetch` for AWS
with `vi.stubGlobal` and `vi.unstubAllGlobals()` after each, as
`src/BookingPage.test.tsx:8–11` does; test lines at or under code lines):

1. `texts the owner and emails the inbox from one request`: both fakes
   called once; 200; body `{ ok: true, email: "sent", sms: "sent" }`; the
   SMS body begins `New booking from drplumbing.pages.dev` (the test origin)
   and contains `Details: No heat <script>`.
2. `the email still goes when the text fails, and the visitor sees
   success`: AWS 400; 200 with `sms: "failed"`; the email fake was called.
3. `the text still goes when the email fails`: binding 500; 200 with
   `email: "failed", sms: "sent"`.
4. `both failing is the visitor's error`: 502.
5. The existing `reports missing configuration and upstream failure`
   becomes: no binding and no secrets gives 503; secrets only gives 200 with
   `email: "skipped"`.

**Edge cases.**

1. Honeypot filled: 200 `{ ok: true }`, neither channel attempted
   (`contact.ts:76`, unchanged; the body tells a bot nothing more).
2. Form too fast or stale: 400, nothing attempted (`78–81`, unchanged).
3. Neither channel configured: 503 `Delivery is not configured.` (today
   `Email delivery is not configured.`, `86–88`).
4. Binding missing, secrets present: text only; 200 with `email: "skipped"`.
5. Email throws or returns non-OK, text sent: 200, `email: "failed"`, one
   warn line.
6. Text failed or skipped, email sent: 200; the visitor's experience is
   today's.
7. Both failed: 502; `src/BookingPage.tsx:153` shows "We could not send your
   request. Try again, or call or text (206) 671-8888." and the button
   re-enables (`152`).
8. One channel hangs: the text is bounded at 8 seconds; the binding call has
   no timeout today and keeps none (unchanged risk, noted); `allSettled`
   waits for the slower.
9. Duplicate submit: the button is disabled while sending (`152`); a second
   press after an error runs both channels again; the owner may get two
   texts for one visitor.
10. Preview deployment: no secrets, so `sms: "skipped"`; the email goes to
    the owner inbox as today, so a preview form test is still coordinated
    with the owner (`README.md:92`).
11. Local run with `npx wrangler pages dev dist`: no `.dev.vars` skips with
    the warn; a `.dev.vars` with the five values sends real, paid texts.
12. `npm run dev` (Vite): `/api/contact` is 404 as today (`README.md:56`).
13. The response gains two fields; `src/BookingPage.tsx:93` reads
    `response.ok` only, so no front-end change.
14. Logs carry outcome words and AWS error types; never name, phone, city or
    details (`README.md:289`).
15. The first line's host is the request's: `drplumbingheating.com` or
    `www.drplumbingheating.com` in production; previews skip.

The edge cases above are the ones found before the build. Find the rest: for
every call, every write and every state, ask what happens when it is
missing, fails, repeats or races, and record each case you handle in the PR
body.

### S3 · Jidè: AWS and Cloudflare setup, dry run, merge, live check

**Size S.** Files: `actions/<date>/booking-sms.md` (new; the repo's log of
outside-facing actions, as `actions/2026-10-21/action.md`). Waits on S2. The
steps are Jidè's; an agent may run the AWS CLI steps on his word.
`<ACCOUNT_ID>` is the `zen` profile's account id (`aws sts
get-caller-identity --profile zen --query Account --output text`);
`<OWNER_MOBILE>` is the owner's number in E.164.

1. **Verify the owner's mobile as a destination** (sandbox rule; the first
   code is free; up to 10 numbers):

   ```sh
   aws pinpoint-sms-voice-v2 create-verified-destination-number \
     --destination-phone-number <OWNER_MOBILE> --profile zen --region us-west-2
   # note VerifiedDestinationNumberId; AWS texts a code to the owner's phone
   aws pinpoint-sms-voice-v2 verify-destination-number \
     --verified-destination-number-id <VERIFIED_ID> --verification-code <CODE> \
     --profile zen --region us-west-2
   ```

   If the code expires, `send-destination-number-verification-code
   --verified-destination-number-id <VERIFIED_ID> --verification-channel TEXT`
   sends another.

2. **Create the IAM user, policy and key** in the same account. Save the
   policy JSON above as a local file outside the repo, with `<ACCOUNT_ID>`
   filled in.

   ```sh
   aws iam create-user --user-name drplumbing-booking-sms --profile zen
   aws iam put-user-policy --user-name drplumbing-booking-sms \
     --policy-name send-booking-text --policy-document file://policy.json --profile zen
   aws iam create-access-key --user-name drplumbing-booking-sms --profile zen
   ```

   The last command prints the key once. Put it straight into a CLI profile
   with `aws configure --profile drplumbing-booking-sms` (it prompts, so
   nothing lands in shell history) and into Cloudflare in step 4. Delete the
   printout.

3. **Prove the pair at no charge** with a dry run from that profile:

   ```sh
   aws pinpoint-sms-voice-v2 send-text-message --profile drplumbing-booking-sms \
     --region us-west-2 --destination-phone-number <OWNER_MOBILE> \
     --origination-identity arn:aws:sms-voice:us-west-2:<ACCOUNT_ID>:phone-number/phone-d2d175e381f14d48a070b3f3a92a2f13 \
     --message-body "Dry run" --message-type TRANSACTIONAL --dry-run
   ```

   A `MessageId` back means the policy, the ARN and the verified destination
   all agree. `AccessDenied` means the policy's `Resource` and the
   `--origination-identity` differ; make them the same ARN.

4. **Set the five Pages secrets, production only**, before merging:

   ```sh
   npx wrangler pages secret put AWS_SMS_ACCESS_KEY_ID --project-name drplumbing
   npx wrangler pages secret put AWS_SMS_SECRET_ACCESS_KEY --project-name drplumbing
   npx wrangler pages secret put AWS_SMS_REGION --project-name drplumbing
   npx wrangler pages secret put AWS_SMS_ORIGINATION_IDENTITY --project-name drplumbing
   npx wrangler pages secret put SMS_OWNER_NUMBER --project-name drplumbing
   ```

   Each prompts for its value. Then confirm in the dashboard (Workers & Pages
   › drplumbing › Settings › Variables and Secrets) that the five are under
   Production and none under Preview.

5. **Merge** the PR `project/booking-sms` → `main` (Jidè merges; nobody
   pushes `main`). Cloudflare publishes within about three minutes
   (`README.md:81–82`).

6. **Live check.** Submit one real booking on
   `https://drplumbingheating.com/book/` (name "Test", the business phone).
   Within a minute the owner's phone shows the text from `+1 855-771-3501`
   and the inbox shows the email. Record the time, the outcome and the two
   `sms`/`email` values from the response (DevTools › Network) in
   `actions/<date>/booking-sms.md`. Cost: about $0.024.

7. **Rename the PR** to "Text the owner when a visit is booked" and mark it
   ready before step 5; the PR body states test lines and code lines per
   file and the edge cases handled.

**Edge cases.**

1. The verification code expires (`VERIFICATION_CODE_EXPIRED`): send another;
   `VERIFICATION_ATTEMPTS_PER_DAY` is a quota, so keep the owner on the phone.
2. Step 3 refused with `DESTINATION_PHONE_NUMBER_NOT_VERIFIED`: step 1 did
   not finish.
3. Secrets set after the merge: the live Function skips the text until the
   next deployment; retry the deployment in Cloudflare or merge the next
   change.
4. A secret pasted with a stray space or newline: every send fails as a 403
   by type; re-put the secret and redeploy.
5. The owner texts STOP: texts fail with `DESTINATION_PHONE_NUMBER_OPTED_OUT`
   until he texts UNSTOP or START or Jidè runs `delete-opted-out-number
   --opt-out-list-name Default --opted-out-number <OWNER_MOBILE>`.
6. The $1 monthly cap binds (about 40 typical bookings): texts fail with
   `MONTHLY_SPEND_LIMIT_REACHED_FOR_TEXT` until the month turns; the email
   continues. Raising it is a Service Quotas request for
   `TEXT_MESSAGE_MONTHLY_SPEND_LIMIT` in that account, Jidè's call.
7. Key rotation later: `create-access-key` again, `pages secret put` the two
   values, redeploy, then `delete-access-key` for the old one.

The edge cases above are the ones found before the build. Find the rest: for
every call, every write and every state, ask what happens when it is
missing, fails, repeats or races, and record each case you handle in the PR
body.

### Order and checkpoints

```
S1 module ──► S2 fan-out + README ──► S3 setup, dry run, merge, live check
```

- **Checkpoint 1**, after S1: `npm run check` green; the module's three
  outcomes and four header examples pass; test lines at or under code lines.
- **Checkpoint 2**, after S2: `npm run check` green; the Cloudflare preview
  of `project/booking-sms` answers a form test with `"sms": "skipped"` and
  the email arrives (coordinate the test with the owner); the PR body has
  the line counts and the edge cases handled.
- **Checkpoint 3**, after S3: the live text and email from one booking,
  recorded in `actions/`.

## Audits (create-a-project §10), run October 25, 2026

1. **What exists.** Above, "What exists in the repo". No requirements doc,
   spec or UML covers this feature in the DrPlumbing repo; the only design is
   Jidè's sentence and the existing code. The delta is the three tickets.
2. **Reuse and refactor.** `git grep -n -E "function json\(|singleLine|
   contactMessage|waitUntil|AbortSignal|allSettled|console\.(log|warn|error)"
   origin/main -- functions src email-worker scripts`: `json()` at
   `functions/api/contact.ts:205` and `email-worker/src/index.ts:96`;
   `singleLine` at `contact.ts:195`; `contactMessage` at `contact.ts:174`;
   `AbortSignal.timeout` at `scripts/check-links.mjs:66`; `console.warn` at
   `check-links.mjs:158`; no `allSettled`, no `waitUntil`. Finding: the
   booking field order lives in two server places after S2 unless
   `bookingLines` is extracted, so S2's first commit extracts it.
3. **Edge cases per ticket.** In each ticket; the index above maps them.
4. **Every reference is real.** `git cat-file -e origin/main:<path>` passed
   for every existing path named here: `src/BookingPage.tsx`,
   `src/booking.ts`, `src/BookingPage.test.tsx`, `functions/api/contact.ts`,
   `functions/api/contact.test.ts`, `email-worker/src/index.ts`,
   `email-worker/src/index.test.ts`, `email-worker/wrangler.jsonc`,
   `wrangler.jsonc`, `package.json`, `package-lock.json`, `README.md`,
   `src/businessFacts.ts`, `src/seo.ts`, `.gitignore`, `CLAUDE.md`,
   `AGENTS.md`, `scripts/check-links.mjs`. New files are marked "(new)".
   Line numbers are from `origin/main` at `0ce70dd`. UI strings quoted are
   from `src/BookingPage.tsx:153` and `:152`.
5. **Dependencies across projects.** The toll-free number and its
   registration belong to MapPack (registration approved October 23, 2026);
   no Linear ticket for that registration was found by search. S3 depends on
   it staying `ACTIVE`. Nothing else in Linear blocks or is blocked.
6. **Honest sizes.** S1 four files, S2 three, S3 one.
7. **The builder keeps looking.** Every ticket ends with the line. Once more
   for the plan: the edge cases above are the ones found before the build.
   Find the rest: for every call, every write and every state, ask what
   happens when it is missing, fails, repeats or races, and record each case
   you handle in the PR body.

## Deploy and cost

Deploy is the merge. Cloudflare builds `main` and publishes
`drplumbingheating.com`; Jidè merges on his own word; nobody pushes `main`
(`README.md:81–82`). The email Worker is not touched and not redeployed.
S3 hands Jidè the exact commands above, with placeholders, never values.

Cost, from AWS's SMS pricing CSV (linked from the
[pricing page](https://aws.amazon.com/end-user-messaging/pricing/), read
October 25, 2026): United States, toll-free, `0.00774` plus a carrier fee of
`0.00421`, so **$0.01195 per message part**; 10DLC is the same per part, plus
its own number and campaign fees, which we do not pay. Billing is per part
([character limits](https://docs.aws.amazon.com/sms-voice/latest/userguide/sms-limitations-character.html):
"you're charged for the number of message parts"). The example text is two
parts, about $0.024; the longest text the module allows is ten parts, about
$0.12. The number's $2.00 monthly lease is MapPack's and has run since
October 15. There is no subscription in this feature; the sandbox caps the
account's texts at $1.00 a month, about 83 parts or 40 typical bookings,
until Jidè raises it.

## Open questions for Jidè

1. **Is `+1 855-771-3501` the SMS you mean?** It is the only approved
   origination identity in either AWS account, and its registration is
   MapPack's (sole proprietor, MapPack sample messages, `mappack-fabf1.web.app`),
   in the `zen` profile's account. Dr Plumbing's booking texts would come from
   a MapPack-registered number. If that is fine, S3 proceeds as written. If
   not, Dr Plumbing needs its own toll-free number and registration ($2 a
   month, a registration wait), and S3 changes its ARN.
2. **Sandbox: verify the owner's mobile now, or request production access
   first?** The plan assumes verifying now (one code the owner reads back,
   free). Production access is a support case with a 24-hour first response
   and the same $1 cap until raised.
3. **The $1 monthly cap: keep it as the guard, or raise it?** About 40
   typical bookings a month before texts stop for the month; email continues.
4. **First line wording.** The plan uses your words, "New booking from
   drplumbingheating.com". "MapPack: new booking from drplumbingheating.com"
   would match the registered brand on the number.
5. **One destination or two?** The plan texts the owner only. Your own mobile
   as a second destination is one more verified number and one more send
   per booking.

## Decided details (veto lines)

Decided under the sourced-details rule; none blocks the build; each is a
one-line change.

1. The Pages Function fans out; the email Worker is untouched.
2. Five Pages secrets, production only; previews and local runs skip the
   text and say so.
3. aws4fetch signs; the module sends once itself with an 8-second timeout;
   nothing retries.
4. `MessageType` `TRANSACTIONAL`; `MaxPrice` `0.15`; `TimeToLive` left at
   AWS's 72-hour default (a late text still names a real lead).
5. The text normalizes curly quotes, dashes, ellipsis and non-breaking
   spaces, keeps every other customer character, and cuts Details only, at
   1,530 or 630 characters, ending ` [cut]`.
6. Success is either channel delivered; error is both failed; the response
   names both outcomes.
7. Logs carry outcome words and AWS error type and reason only.
8. No dedupe of a visitor's second submit.
9. The first line names the request's host, not a constant.
