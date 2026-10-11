/**
 * Description: Keeps the site's public GA4 configuration separate from customer and business facts.
 * Inputs: T1 (JDA-242) must supply the real Measurement ID and record the owner's consent choice.
 * Output: An empty ID deliberately disables collection until that manual setup is recorded.
 * Examples: Analytics.test.ts verifies the exact production hosts and disabled setup.
 */
import { init } from "mappack-web-analytics";
// Owner setup is pending. This public ID is not a credential; fill it only from the T1 record.
export const GA_MEASUREMENT_ID: string = "";
export const PRODUCTION_HOSTS = ["drplumbingheating.com", "www.drplumbingheating.com"];

/**
 * Description: Initializes the site's host-gated analytics after React renders.
 * Inputs: None; uses the owner-confirmed public ID and exact production hosts above.
 * Output: The package's enabled/stop handle; an empty ID or preview host sends nothing.
 * Examples: Analytics.test.ts checks the configuration passed to init and preview isolation.
 */
export function startAnalytics() {
  return init({ measurementId: GA_MEASUREMENT_ID, hosts: PRODUCTION_HOSTS });
}
