import React from "react";
import { PROJECTS } from "../data/projects.js";
import { WA } from "../config.js";
import { Header, Footer, Breadcrumbs } from "../components/Layout.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function AreaPage({ area }) {
  const projects = PROJECTS.filter((p) => p.area === area.area);
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="badge badge-alt">Authorized Channel Partner</span>
            <h1>{area.h1}</h1>
            <p className="lead">{area.lead}</p>
            <a className="btn btn-primary" href="#projects">View Projects</a>{" "}
            <a className="btn btn-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Chat on WhatsApp</a>
          </div>
        </section>
        <div className="wrap">
          <Breadcrumbs items={[["Home", "/"], [area.h1, ""]]} />
        </div>
        <section>
          <div className="wrap" dangerouslySetInnerHTML={{ __html: area.introHtml }} />
        </section>
        <section id="projects">
          <div className="wrap">
            <h2>All Eldeco Projects in {area.area}</h2>
            <div className="grid">
              {projects.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
