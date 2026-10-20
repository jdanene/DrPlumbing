/**
 * Description: Reuses the business's six Google reviews as readable text, with first names only.
 * Inputs: Google Business Profile read on 2026-10-20. Quoted excerpts retain original wording.
 * Output: Five short excerpts and one rating with service tags; no invented sixth quotation.
 * Examples: Orlando has no quote because his Google review contains only a rating and tags.
 */
export const REVIEW_SOURCE = "https://www.google.com/search?kgmid=/g/11rj_y8_m5&hl=en-US&q=MB+Plumbing+%26+Heating+Group";
export const CUSTOMER_REVIEWS = [
  { name: "Mike", rating: 5, quote: "They did a complete whole-house water supply repipe, drain line replacement, and installed a tankless water heater", excerpt: true },
  { name: "Jorge", rating: 5, quote: "The services were rendered directly by close supervision of the owner. Response time and quality of work were excellent.", excerpt: true },
  { name: "shafiq", rating: 5, quote: "I'm a realtor and referred this company for so many clients, everyone is happy with his performance and price. definitely recommend this company.", excerpt: false },
  { name: "Annie", rating: 5, quote: "Mohammed is awesome, fast and professional. … Was able to respond to a crisis situation we were in with a water heater leak.", excerpt: true },
  { name: "Peter", rating: 5, quote: "Honestly, I’ve never seen such dedication and service. They fixed every problem we had. With a great attitude as well.", excerpt: true },
  { name: "Orlando", rating: 5, tags: "Drain cleaning. Responsiveness, punctuality and professionalism.", excerpt: false },
] as const;
