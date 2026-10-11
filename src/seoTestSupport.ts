import { headTags } from "./seo";

/**
 * Description: Reads one schema.org node out of a route's JSON-LD, the way a crawler would. Shared
 * by the SEO tests so each asserts on parsed nodes instead of on JSON text.
 * Inputs: route is any entry of PUBLIC_ROUTES; idSuffix is the end of the node's "@id", such as "#business".
 * Output: The parsed node. Throws when the route has no JSON-LD or no node with that id, so a
 * missing node fails the test that asked for it instead of passing vacuously.
 * Examples: Seo.test.ts: graphNode("home", "#business")["@type"] is ["Plumber", "HVACBusiness"];
 * graphNode("water-heaters", "#service").name is "Water heaters"; graphNode("home", "#service") throws.
 */
export function graphNode(route: string, idSuffix: string): Record<string, unknown> {
  const script = headTags(route).find((tag) => tag.tag === "script");
  if (!script?.text) throw new Error(`${route} has no JSON-LD`);
  const graph: Record<string, unknown>[] = JSON.parse(script.text)["@graph"];
  const node = graph.find((entry) => String(entry["@id"]).endsWith(idSuffix));
  if (!node) throw new Error(`${route} has no ${idSuffix} node`);
  return node;
}
