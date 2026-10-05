import { routeHref } from "./sitePaths";
import { useState } from "react";
import { WORK_PROJECTS } from "./projectPhotos";
import { Arrow, CallToAction } from "./SiteContent";
import ProjectPhoto from "./ProjectPhoto";

/**
 * Description: Shows photographed work, grouped by the services customers need.
 * Inputs: None; the selected project catalog supplies photographs and captions.
 * Output: Project cards in the selected category; filters retain keyboard focus.
 * Examples: All shows sixteen projects; Water heaters shows three; Boilers shows four.
 */
export default function WorkPage() {
  const [category, setCategory] = useState("All");
  const projects = WORK_PROJECTS.filter(
    (project) => category === "All" || project.category === category,
  );
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
            {["All", "Plumbing", "Water heaters", "Drain & sewer", "Water filtration", "Heating & cooling", "Boilers"].map((value) => (
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
          <div className="work-grid">
            {projects.map((project) => (
              <article className="work-card" key={project.title}>
                <a className="pics" href={project.photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${project.title}`}>
                  <ProjectPhoto photo={project.photo} />
                </a>
                <div className="cat">{project.category}</div>
                <h3>{project.title}</h3>
                <p className="muted">{project.description}</p>
                <a className="work-service-link" href={routeHref(project.service)}>Explore {project.category.toLowerCase()} <Arrow /></a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div className="wrap">
        <CallToAction title="Want work like this in your home?" />
      </div>
    </div>
  );
}
