import { pathSlug, routeHref } from "./sitePaths";
import { useState } from "react";
import { REMODELING_PROJECTS, WORK_PROJECTS, type WorkProject } from "./projectPhotos";
import { Arrow, CallToAction } from "./SiteContent";
import ProjectPhoto from "./ProjectPhoto";
import { serviceOptionHref } from "./serviceDetails";

/**
 * Description: Renders a project with its source photo, caption and service destination.
 * Inputs: project is a catalog record; remodeling keeps the full photo and links to the remodeling page.
 * Output: One article with accessible full-image and service links.
 * Examples: ResidentialProjects.test.tsx checks featured projects; App.test.tsx checks category counts.
 */
function WorkCard({ project, remodeling = false }: { project: WorkProject; remodeling?: boolean }) {
  const [service, option] = project.service.split("/");
  const destination = remodeling
    ? serviceOptionHref("plumbing", "Complete bathroom remodeling")
    : option ? serviceOptionHref(service, option) : routeHref(service);
  return (
    <article className="work-card">
      <a className="pics" href={project.photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${project.title}`}>
        <ProjectPhoto photo={project.photo} fullFrame={remodeling} />
      </a>
      {!remodeling && <div className="cat">{project.category}</div>}
      <h3>{project.title}</h3>
      <p className="muted">{project.description}</p>
      <a className="work-service-link" href={destination}>
        Explore {remodeling ? "bathroom remodeling" : project.category.toLowerCase()} <Arrow />
      </a>
    </article>
  );
}

/**
 * Description: Shows photographed work, grouped by the services customers need.
 * Inputs: None; the selected project catalog supplies photographs and captions.
 * Output: Project cards in the selected category; filters retain keyboard focus.
 * Examples: All shows the full catalog; Water heaters filters by category; existing projects remain available.
 */
/** The filter and section order Jidè set on October 22: the jobs people ask about most first, heating last. */
const WORK_CATEGORIES = ["Water heaters", "Bathroom remodeling", "Plumbing", "Drain & sewer", "Water filtration", "Boilers", "Heating & cooling"];

export default function WorkPage() {
  const [category, setCategory] = useState("All");
  const projects = WORK_PROJECTS.filter(
    (project) => category === "All" || project.category === category,
  );
  const featured = REMODELING_PROJECTS.filter(project => projects.includes(project));
  const remaining = projects.filter(project => !featured.includes(project));
  // Each service gets its own heading, in the filter order, so a reader or a crawler finds the water heater or boiler jobs by name.
  const groups = WORK_CATEGORIES.map((name) => {
    const remodeling = name === "Bathroom remodeling";
    return { name, remodeling, projects: remodeling ? featured : remaining.filter((project) => project.category === name) };
  }).filter((group) => group.projects.length > 0);
  return (
    <div className="view is-active" data-view="work">
      <section className="block" style={{ paddingTop: "clamp(32px,5vw,64px)" }}>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={routeHref("home")}>Home</a>
            <span>/</span>
            <span>Our work</span>
          </nav>
          <h1
            tabIndex={-1}
            style={{
              fontSize: "clamp(40px,6vw,76px)",
              fontWeight: 800,
              margin: "16px 0 14px",
            }}
          >
            Real jobs. Real photos.
          </h1>
          <p className="lead" style={{ maxWidth: 640, marginBottom: 28 }}>
            Every photo here is a Dr Plumbing &amp; Heating project, taken on the
            job.
          </p>
          <div className="chips" role="group" aria-label="Filter projects">
            {["All", ...WORK_CATEGORIES].map((value) => (
              <button
                className="chip"
                type="button"
                aria-pressed={value === category}
                key={value}
                onClick={() => setCategory(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status">
            {projects.length} projects
          </p>
          {groups.map((group) => (
            <section key={group.name} className={group.remodeling ? "work-remodeling" : undefined} aria-labelledby={`work-${pathSlug(group.name)}-title`}>
              <h2 className={group.remodeling ? undefined : "work-other-title"} id={`work-${pathSlug(group.name)}-title`}>{group.name}</h2>
              {group.remodeling && <p className="lead">From framing, electrical and plumbing to finished fixtures, showers and tubs.</p>}
              <div className="work-grid">
                {group.projects.map(project => <WorkCard key={project.photo.src} project={project} remodeling={group.remodeling} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
      <div className="wrap">
        <CallToAction title="Want work like this in your home?" />
      </div>
    </div>
  );
}
