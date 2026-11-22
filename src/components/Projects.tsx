"use client";

import { projects } from "@/data/profile";

export default function Projects() {
  return (
    <section className="section" id="artifacts">
      <div className="section-head" data-reveal>
        <div>
          <div className="mono text-red">[ 004 ] // SELECTED WORK</div>
          <h2 className="section-head__title">
            ARTIFACTS<em>_</em>
          </h2>
        </div>
        <div className="section-head__meta mono-xs">
          RECOVERED: 04
          <br />
          SOURCE: GITHUB/PORTERFRAG
        </div>
      </div>

      <div className="projects">
        {projects.map((project) => (
          <article className="project" key={project.id} data-reveal>
            <div className="project__head mono-xs">
              <span>ARTIFACT_{project.id}</span>
              <span className="project__status">{project.status}</span>
            </div>
            <h3 className="project__name">{project.name}</h3>
            <div className="project__repo mono-xs">REPO: {project.repo}</div>
            <p className="project__desc">{project.description}</p>
            <div className="project__stack">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <div className="project__links">
              <a href={project.href} target="_blank" rel="noreferrer">
                VIEW SOURCE <span aria-hidden="true">↗</span>
              </a>
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer">
                  LIVE DEMO <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
