---
version: 1
slug: "src-sitecontent-tsx"
primary_target: "src/SiteContent.tsx"
related_targets: ["src/BathroomRemodeling.tsx","src/HomePage.tsx","src/WorkPage.tsx","src/projectPhotos.ts","src/ProjectPhoto.tsx","src/serviceDetails.ts","src/SiteShell.tsx","src/CityPage.tsx","src/cities.ts","src/index.css"]
---

## Direction contract

THESIS: Show real project work beside the service it demonstrates. Put complete bathroom remodeling first under General Plumbing and reuse the current Mercer Island hierarchy across the selected cities.

OWN-WORLD: Preserve the site's off-white/dark theme, copper buttons, existing type, small photo corners and full-frame project images.

STORY: Homeowners see finished rooms and installation work, understand the owner's confirmed service scope, and reach the relevant service and booking route for their city.

SCOPE: The dedicated bathroom remodeling page, homepage teaser and Our Work remodeling section share owner-supplied photographs and service destinations. The homepage teaser pairs the remodeling scope with the double-vanity photograph and links to the dedicated page. Bellevue, Renton, Kirkland, Redmond and Issaquah replicate Mercer Island, retaining Federal Way and Newcastle. Each city has 43 pages: an overview, six service categories and 36 options. City names, landmarks, metadata and service navigation follow the current city; verified landmark sources live in [cities.ts](../../src/cities.ts).

FIRST VIEWPORT: The dedicated remodeling page uses the existing service hero: scope and booking on the left, the complete bathroom photograph on the right. Stack on phones. Section links lead to fixtures, showers and tubs, and kitchen remodeling, each with matching photographs. Our Work features a labeled remodeling section before the remaining projects.

FORM: Local extension, no concept seed required. Fixtures, showers and kitchen remodeling sit under the dedicated remodeling page as anchors. Prior fixture and shower URLs remain available. Selected original project photos appear under Plumbing, Boilers, Drain & sewer and Water filtration, with shared galleries on city equivalents. The missing sink joins the fixture gallery and Our Work; the electronic toilet remains. The owner-rejected cream cast-iron radiator (`086_IMG_3535.jpg`) is absent from displayed pages; its source files remain. The towel radiator (`014_IMG_0653.jpg`) illustrates radiators, baseboards and radiant flooring.

FINISH: Ship. The final screenshot review found no material fixes. Desktop and mobile fixture views retain the restored sink and electronic toilet; the ordinary boiler-card capture resolved the stitched-image concern. The full 530-test suite passed. After the final Redmond landmark correction, 375 targeted tests and the production build passed, rendering 397 pages and checking 55 photos. Jide authorized production deployment on October 18, 2026.

The existing palette, typography and tokens remain. Local remodeling and gallery layout rules extend [index.css](../../src/index.css); no new visual system, DESIGN.md or design sidecar is introduced. Source URLs and image treatment are recorded in [owner-additions.json](../../design/photo-classification/owner-additions.json).
