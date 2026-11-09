import React, { useEffect, useMemo, useState } from "react";
import { PROJECTS } from "../data/projects.js";
import { CONTENT } from "../data/content.js";
import { PHONE, WA } from "../config.js";
import { Header, Footer } from "../components/Layout.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function HomePage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  const shown = useMemo(() => {
    const needle = q.toLowerCase();
    return PROJECTS.map((p) => {
      const txt = `${p.name} ${p.location} ${p.config} ${p.area}`.toLowerCase();
      const ok = (!needle || txt.includes(needle)) && (!area || p.area === area) && (!status || p.status === status);
      return { p, ok };
    });
  }, [q, area, status]);
  const shownCount = shown.filter((s) => s.ok).length;

  return (
    <>
      <Header />
      <section className="hero">
        <div className="wrap">
          <span className="badge badge-alt">Authorized Channel Partner</span>
          <h1>Eldeco Group Projects in Noida, Greater Noida &amp; Yamuna Expressway</h1>
          <p className="lead">
            Homes by Eldeco Group — North India's trusted developer since 1985 — across Sector 150 Noida, Greater Noida and the Yamuna Expressway corridor near the upcoming Noida International Airport.
          </p>
          <a className="btn btn-primary" href="#projects">Explore Projects</a>{" "}
          <a className="btn btn-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Chat on WhatsApp</a>
          <div className="stats">
            <div className="stat"><b>Since 1985</b>40+ Years of Legacy</div>
            <div className="stat"><b>175+</b>Projects Delivered</div>
            <div className="stat"><b>30,000+</b>Happy Families</div>
            <div className="stat"><b>22</b>Projects in Noida Region Listed Here</div>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="wrap">
          <h2>Eldeco Projects — Noida, Greater Noida &amp; Yamuna Expressway</h2>
          <div className="controls">
            <input
              type="search"
              id="q"
              placeholder="Search project, sector or configuration…"
              aria-label="Search projects"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select id="f-area" aria-label="Filter by area" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">All Areas</option>
              <option>Noida</option>
              <option>Greater Noida</option>
              <option>Yamuna Expressway</option>
            </select>
            <select id="f-status" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option>Ongoing</option>
              <option>New Launch</option>
              <option>Completed</option>
            </select>
          </div>
          {!ready ? (
            <div id="skeletons" className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="skeleton" key={i}></div>
              ))}
            </div>
          ) : null}
          <div id="project-grid" className="grid" hidden={!ready}>
            {shown.map(({ p, ok }) => (
              <ProjectCard key={p.slug} p={p} style={ok ? undefined : { display: "none" }} />
            ))}
          </div>
          <div id="empty-state" className="empty-state" hidden={!(ready && shownCount === 0)}>
            <h3>No projects match your search</h3>
            <p>Try a different sector or configuration — or ask us on WhatsApp, we'll find the right Eldeco home for you.</p>
            <a className="btn btn-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        </div>
      </section>

      <section id="areas">
        <div className="wrap">
          <h2>Eldeco Projects by Area</h2>
          <div className="grid">
            {CONTENT.areaCards.map((c) => (
              <div className="card" key={c.href}>
                <div className="card-body">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <a className="btn btn-primary" href={c.href}>{c.label}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2>About Eldeco Group</h2>
          <p>
            The Eldeco Group has been a leading name in real estate development across North India since 1985. As per the official Eldeco website, the group has delivered more than 175 projects — townships, high-rise condominiums, industrial estates, malls and office complexes — with 30+ projects in various stages of execution and more than 30,000 satisfied customers. Eldeco avoids repetition in design, so each project becomes a unique landmark in its local geography.
          </p>
          <h2>Why Buy an Eldeco Home Through Us?</h2>
          <div className="grid">
            <div className="card"><div className="card-body"><h3>Official Details Only</h3><p>Every RERA number, configuration and amenity here is taken from the official Eldeco Group project page — nothing invented.</p></div></div>
            <div className="card"><div className="card-body"><h3>Price on Request, No Pressure</h3><p>Current price, payment plans and unit availability confirmed transparently on call or WhatsApp.</p></div></div>
            <div className="card"><div className="card-body"><h3>Guided Site Visits</h3><p>We arrange and accompany site visits across Noida, Greater Noida and Yamuna Expressway projects.</p></div></div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2>Frequently Asked Questions — Eldeco Projects in Noida Region</h2>
          {CONTENT.home.faqs.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="enquire">
        <div className="wrap two-col">
          <div>
            <h2>Enquire Now</h2>
            <p>Tell us which Eldeco project you're considering — we'll reply on WhatsApp with the latest price, floor plans and availability.</p>
            <p>
              📞 Call: <a href={`tel:+91${PHONE}`}>+91 {PHONE}</a>
              <br />
              💬 WhatsApp: <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Chat now</a>
            </p>
          </div>
          <aside>
            <EnquiryForm project="General Enquiry — Eldeco Projects" />
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
