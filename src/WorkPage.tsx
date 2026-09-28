import { useState } from "react";
import { PROJECTS, SERVICES } from "./content";
import { CallToAction, Camera } from "./SiteContent";

/**
 * Description: Lets reviewers filter the mockup's project-photo slots without inventing completed jobs.
 * Inputs: None; categories derive from the service catalog.
 * Output: Nine placeholder cards or the selected category; filters retain keyboard focus.
 * Examples: App.test.tsx filters water heaters, boilers, and All, checking the visible card count.
 */
export default function WorkPage() {
  const [category, setCategory] = useState("All");
  const projects = PROJECTS.filter(
    (project) => category === "All" || project.cat === category,
  );
  return (
    <div className="view is-active" data-view="work">
      <section className="block" style={{ paddingTop: "clamp(32px,5vw,64px)" }}>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
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
            Real jobs in real homes.
          </h1>
          <p className="lead" style={{ maxWidth: 640, marginBottom: 28 }}>
            Every photo here is a Dr Plumbing &amp; Heating project, taken on the
            job.
          </p>
          <div className="chips" role="group" aria-label="Filter projects">
            {["All", ...SERVICES.map((service) => service.tab)].map((value) => (
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
            {projects.length} project placeholders
          </p>
          <div className="work-grid">
            {projects.map((project) => (
              <article className="work-card" key={project.title}>
                <div
                  className="pics"
                  style={
                    project.ba
                      ? { gridTemplateColumns: "repeat(2,minmax(0,1fr))" }
                      : undefined
                  }
                >
                  {project.ba ? (
                    <>
                      <div className="ph">
                        <b>BEFORE</b>
                      </div>
                      <div className="ph">
                        <b>AFTER</b>
                        <small>Same angle</small>
                      </div>
                    </>
                  ) : (
                    <div className="ph">
                      <Camera />
                      <b>PHOTO: {project.shot}</b>
                    </div>
                  )}
                </div>
                <div className="cat">{project.cat}</div>
                <h3>{project.title}</h3>
                <span className="muted">[City] · [Month Year]</span>
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
