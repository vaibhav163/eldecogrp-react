import React from "react";
import { PROJECTS } from "../data/projects.js";
import { PHONE, WA } from "../config.js";
import { Header, Footer, Breadcrumbs } from "../components/Layout.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { areaPageName, areaPageUrl, projectWaLink, waText } from "../lib/site.js";

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

export default function ProjectPage({ p }) {
  const waLink = projectWaLink(p);
  const hero = p.images.hero;
  const gallery = p.images.gallery;
  const extra = p.images.extra;
  const completed = p.status === "Completed" && p.completedHtml;

  const cfgItems = [
    ["Type", p.config],
    ["Location", p.location],
    ["Status", p.status],
    ["Price", "On Request"],
  ];
  if (p.launch) cfgItems.push(["Launched", p.launch]);
  if (p.rera) cfgItems.push(["RERA", "Registered"]);

  const fpCta = waText(`Hi, please share the floor plans of ${p.name}, ${p.location}.`);
  const fpRows = (
    <div className="p-fp-details">
      <div className="p-fp-row"><h6>Configuration</h6><span>{p.config}</span></div>
      <div className="p-fp-row"><h6>Price</h6><span><strong>On Request</strong></span></div>
      <div className="p-fp-row"><h6>Status</h6><span>{p.status}</span></div>
    </div>
  );

  const relatedProjects = (p.related || []).map((s) => bySlug[s]).filter(Boolean);

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          ["Home", "/"],
          [areaPageName(p.area), areaPageUrl(p.area)],
          [p.name, ""],
        ]}
      />
      <section className="p-banner" style={{ backgroundImage: `url('${hero}')` }}>
        <div className="p-banner-box">
          <p className="p-banner-over">{p.config}</p>
          <h1>{p.name}</h1>
          <p className="p-banner-loc">📍 {p.location}</p>
          <div className="p-banner-price">
            Price: <strong>On Request</strong>
          </div>
          <div className="p-banner-cta">
            <a className="p-btn p-btn-light" href="#enquire">Enquire Now</a>
            <a className="p-btn p-btn-wa" href={waLink} target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
        <div className="p-banner-badges">
          <span className="badge">{p.status}</span>
          <span className="badge badge-alt">{p.area}</span>
          {p.rera ? (
            <span className="badge badge-rera">RERA: {p.rera}</span>
          ) : (
            <span className="badge badge-rera">Completed Project</span>
          )}
        </div>
      </section>

      <div className="p-config">
        <div className="wrap p-config-row">
          {cfgItems.map(([k, v]) => (
            <div className="p-cfg-box" key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <nav className="anchor-nav">
        <div className="wrap">
          <a href="#overview">Overview</a>
          <a href="#amenities">Amenities</a>
          <a href="#floorplans">Floor Plans</a>
          <a href="#price">Price</a>
          <a href="#gallery">Gallery</a>
          <a href="#location">Location</a>
          <a href="#enquire">Enquire</a>
        </div>
      </nav>

      <section id="overview" className="p-sec">
        <div className="wrap two-col">
          <div>
            <h2 className="p-heading">Overview — {p.name}</h2>
            <p className="p-lead">{p.overview}</p>
            {completed ? <div dangerouslySetInnerHTML={{ __html: p.completedHtml.overviewExtra }} /> : null}
            <table className="fact-table p-facts">
              <tbody>
                <tr><th>Project</th><td>{p.name} by Eldeco Group</td></tr>
                <tr><th>Location</th><td>{p.location}</td></tr>
                <tr><th>Configurations</th><td>{p.config}</td></tr>
                <tr><th>Status</th><td>{p.status}</td></tr>
                {p.launch ? <tr><th>Launch Date</th><td>{p.launch}</td></tr> : null}
                {p.rera ? <tr><th>RERA No.</th><td>{p.rera}</td></tr> : null}
                <tr><th>Price</th><td>On Request</td></tr>
              </tbody>
            </table>
            {p.rera ? (
              <p className="rera-line">
                <strong>UP RERA Reg. No.: {p.rera}</strong> — Verify at{" "}
                <a href="https://www.up-rera.in/" target="_blank" rel="noopener">up-rera.in</a>. Details sourced from the{" "}
                <a href={p.official} target="_blank" rel="noopener">official Eldeco Group project page</a>.
              </p>
            ) : (
              <p className="rera-line">
                This is a completed project listed on the{" "}
                <a href={p.official} target="_blank" rel="noopener">official Eldeco Group website</a>. No RERA number is published for it on the official page — verify project details at{" "}
                <a href="https://www.up-rera.in/" target="_blank" rel="noopener">up-rera.in</a>.
              </p>
            )}
          </div>
          <aside className="sticky-form p-aside" id="enquire">
            <EnquiryForm project={p.name} variant="proj" />
          </aside>
        </div>
      </section>

      {p.amenities.length ? (
        <section id="amenities" className="p-sec p-amen-sec">
          <div className="wrap">
            <h2 className="p-heading">World-Class Amenities</h2>
            <div className="p-amen-grid">
              {p.amenities.map((a) => (
                <div className="p-amen-item" key={a}>
                  <span className="p-amen-ic" aria-hidden="true">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="floorplans" className="p-sec">
        <div className="wrap">
          <h2 className="p-heading">Floor Plans</h2>
          <div className="p-fp-card">
            <div className="p-fp-inner">
              {extra ? (
                <img
                  loading="lazy"
                  className="p-fp-img"
                  src={extra}
                  alt={`${p.name}, ${p.location} — ${p.extraLabel}`}
                />
              ) : null}
              {fpRows}
              <a className="p-btn" href={fpCta} target="_blank" rel="noopener">Get Floor Plan on WhatsApp</a>
              {extra ? (
                <p className="fine">{p.extraLabel} as published on the official Eldeco Group page for this project. Detailed floor plans are shared on WhatsApp on enquiry.</p>
              ) : (
                <p className="fine">Detailed floor plans for {p.name} are shared on WhatsApp on enquiry — no sizes are published here unless confirmed on the official project page.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {gallery.length ? (
        <section className="p-welcome" style={{ backgroundImage: `url('${gallery[0]}')` }}>
          <div className="p-welcome-inner">
            <p>Welcome to {p.name} — a thoughtfully curated residential destination at {p.location}.</p>
          </div>
        </section>
      ) : null}

      <section id="price" className="p-sec">
        <div className="wrap">
          <h2 className="p-heading">Price List</h2>
          <table className="price-table p-price-table">
            <thead>
              <tr><th>Configuration</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{p.config}</td>
                <td><strong>Price on Request</strong></td>
                <td><a className="p-link" href="#enquire">Enquire →</a></td>
              </tr>
            </tbody>
          </table>
          <p className="fine">Prices are not published on the official project page; current price, payment plan and availability are confirmed on enquiry.</p>
        </div>
      </section>

      {gallery.length ? (
        <section id="gallery" className="p-sec p-gal-sec">
          <div className="wrap">
            <h2 className="p-heading">
              A Glimpse of <span>{p.name}</span>
            </h2>
            <div className="p-gallery-grid">
              {gallery.map((g) => (
                <figure className="p-gal-item" key={g}>
                  <img loading="lazy" src={g} alt={`${p.name}, ${p.location} — gallery image`} />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {p.locationAdv.length ? (
        <section id="location" className="p-sec p-loc-sec">
          <div className="wrap">
            <h2 className="p-heading">Location Advantages</h2>
            <div className="p-loc-grid">
              {p.locationAdv.map(([n, d]) => (
                <div className="p-loc-card" key={n}>
                  <strong>{n}</strong>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {completed && p.completedHtml.locality ? (
        <section
          id="locality"
          className="p-sec"
          dangerouslySetInnerHTML={{ __html: p.completedHtml.locality.html }}
        />
      ) : null}
      {completed && p.completedHtml.resale ? (
        <section
          id="resale"
          className="p-sec p-loc-sec"
          dangerouslySetInnerHTML={{ __html: p.completedHtml.resale.html }}
        />
      ) : null}

      {p.faqs.length ? (
        <section id="faq">
          <div className="wrap">
            <h2>Frequently Asked Questions — {p.name}</h2>
            {p.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {relatedProjects.length ? (
        <section id="related">
          <div className="wrap">
            <h2>More Eldeco Projects in {p.area}</h2>
            <div className="grid">
              {relatedProjects.map((r) => (
                <ProjectCard key={r.slug} p={r} />
              ))}
            </div>
            <a className="area-link" href={areaPageUrl(p.area)}>
              View all Eldeco projects in {p.area} →
            </a>
          </div>
        </section>
      ) : null}

      <section className="p-enquire">
        <div className="wrap">
          <div className="p-enquire-card">
            <h2>Enquire Now</h2>
            <p>Interested in {p.name}? Talk to our team for the latest price, available units, floor plans and a guided site visit.</p>
            <a className="p-btn" href={`tel:+91${PHONE}`}>📞 +91 {PHONE}</a>
            <a className="p-btn p-btn-wa" href={waLink} target="_blank" rel="noopener">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
