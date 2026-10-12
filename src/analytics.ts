/**
 * Description: Keeps the site's public GA4 configuration separate from customer and business facts.
 * Inputs: The Measurement ID of the GA4 property "Dr Plumbing & Heating website", recorded on JDA-242
 * on 2026-10-11, and the two production hosts. The ID is public: every visitor's browser receives it.
 * Output: Collection on the production hosts only; previews and localhost send nothing.
 * Examples: Analytics.test.ts verifies the exact ID and hosts passed to init, and preview isolation.
 */
import { init } from "mappack-web-analytics";
// Public, not a credential. Source: JDA-242, web stream "Dr Plumbing website" for https://drplumbingheating.com.
export const GA_MEASUREMENT_ID = "G-XD2J39S66V";
export const PRODUCTION_HOSTS = ["drplumbingheating.com", "www.drplumbingheating.com"];

/**
 * Description: Initializes the site's host-gated analytics after React renders.
 * Inputs: None; uses the owner-confirmed public ID and exact production hosts above.
 * Output: The package's enabled/stop handle; a preview host sends nothing.
 * Examples: Analytics.test.ts checks the configuration passed to init and preview isolation.
 */
export function startAnalytics() {
  return init({ measurementId: GA_MEASUREMENT_ID, hosts: PRODUCTION_HOSTS });
}
