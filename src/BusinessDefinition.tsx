import { BUSINESS, confirmed } from "./businessFacts";
import { factMonth } from "./agentReadable";

/**
 * Description: States the business identity from the one confirmed fact record.
 * Inputs: None; this is shared by target city answers and general-page footers.
 * Output: A text paragraph, without founding-year or response-time assumptions.
 * Examples: The definition names Mehran's 26+ years, Newcastle and the flat-rate price basis.
 */
export default function BusinessDefinition() {
  const owner = confirmed(BUSINESS.ownerExperience);
  return <p className="business-definition">
    {confirmed(BUSINESS.publicName)} is an owner-operated plumbing and heating company in {confirmed(BUSINESS.homeBase).city}, WA.
    {" "}Its owner, {owner.name}, has been plumbing for {owner.years} years. We serve the Eastside and Greater Seattle with {confirmed(BUSINESS.serviceScope)}.
    {" "}{confirmed(BUSINESS.priceBasis)}
    {" "}As of {factMonth(BUSINESS.ownerExperience.confirmedOn)}.
  </p>;
}
