import ProjectPhoto from "./ProjectPhoto";
import { PHOTOS } from "./projectPhotos";
import { serviceOptionHref } from "./serviceDetails";

/**
 * Description: Introduces the owner's remodeling scope and links to the full service page.
 * Inputs: None; the project catalog supplies the real residential photograph.
 * Output: A homepage section with a full-frame vanity photo and a dedicated page link.
 * Examples: ResidentialProjects.test.tsx checks the destination and lazy-loaded image.
 */
export default function BathroomRemodeling() {
  return (
    <section className="residential-intro wrap" aria-labelledby="residential-remodeling-title">
      <div>
        <h2 id="residential-remodeling-title">Bathroom remodeling,<br />from framing to fixtures.</h2>
        <p>Complete bathroom remodeling, including framing, electrical and plumbing. We also offer complete kitchen remodeling.</p>
        <a className="text-link" href={serviceOptionHref("plumbing", "Complete bathroom remodeling")}>Explore bathroom remodeling →</a>
      </div>
      <figure>
        <ProjectPhoto photo={PHOTOS.doubleVanity} fullFrame />
        <figcaption>A double vanity gives each person their own sink in a shared bathroom.</figcaption>
      </figure>
    </section>
  );

}
