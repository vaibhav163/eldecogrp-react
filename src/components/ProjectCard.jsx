import React from "react";
import { imageDims } from "../lib/site.js";

export default function ProjectCard({ p, style }) {
  const dims = imageDims(p.images.hero);
  const searchTxt = `${p.name} ${p.location} ${p.config} ${p.area}`.toLowerCase();
  return (
    <article className="card" data-area={p.area} data-status={p.status} data-search={searchTxt} style={style}>
      <img
        loading="lazy"
        src={p.images.hero}
        alt={`${p.name}, ${p.location} — Eldeco Group residential project`}
        {...dims}
      />
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="loc">📍 {p.location}</p>
        <p>{p.config}</p>
        <div className="meta">
          <span className="badge">{p.status}</span>
          <span className="badge badge-alt">{p.area}</span>
          <strong>Price on Request</strong>
        </div>
        <a className="btn btn-primary" href={`/projects/${p.slug}.html`}>
          View Details →
        </a>
      </div>
    </article>
  );
}
