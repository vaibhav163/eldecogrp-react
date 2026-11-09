import { SITE_CONFIG, DOMAIN, WA } from "../config.js";
import { CONTENT } from "../data/content.js";

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function areaSlug(area) {
  return CONTENT.areaSlugs[area] || "noida";
}

export function areaPageUrl(area) {
  return `/areas/${areaSlug(area)}.html`;
}

export function areaPageName(area) {
  return area === "Yamuna Expressway" ? "Eldeco Projects on Yamuna Expressway" : `Eldeco Projects in ${area}`;
}

export function waText(text) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
}

export function projectWaLink(p) {
  return waText(`Hi, I am interested in ${p.name}, ${p.location}. Please share price and availability.`);
}

// City for PostalAddress: last part of the location after the final comma, else the area.
export function projectCity(p) {
  const parts = p.location.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : p.area;
}

export function firstRera(rera) {
  if (!rera) return "";
  return rera.split(",")[0].trim();
}

// ---- Improved project-page SEO (name + location targeting) ----
export function projectTitle(p) {
  const withConfig = `${p.name} ${p.location} | ${p.config} — Price on Request`;
  if (withConfig.length <= 78) return withConfig;
  return `${p.name} ${p.location} | Price on Request`;
}

export function projectDesc(p) {
  const rera = firstRera(p.rera);
  return (
    `Explore ${p.name} at ${p.location} — ${p.config} by Eldeco Group. Status: ${p.status}.` +
    (rera ? ` RERA: ${rera}.` : "") +
    ` Price on Request. View floor plans, amenities, gallery & location advantages. Enquire: +91 8799756026.`
  );
}

export function ldBreadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: DOMAIN + url,
    })),
  };
}

export function projectBreadcrumbItems(p) {
  return [
    ["Home", "/"],
    [areaPageName(p.area), areaPageUrl(p.area)],
    [p.name, `/projects/${p.slug}.html`],
  ];
}

export function projectListingLd(p, desc) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.name,
    url: `${DOMAIN}/projects/${p.slug}.html`,
    description: desc,
    address: {
      "@type": "PostalAddress",
      streetAddress: p.location,
      addressLocality: projectCity(p),
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    brand: { "@type": "Brand", name: "Eldeco Group" },
  };
  if (p.rera) ld.identifier = p.rera;
  return ld;
}

export function faqLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function imageDims(src) {
  const d = CONTENT.imageDims[src];
  return d ? { width: d[0], height: d[1] } : {};
}

// ---- client-side helpers (no-ops during SSR) ----
export function showToast(msg) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app-toast", { detail: msg }));
  }
}

export function trackConversion(eventName, params) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.trackConversion === "function") {
      window.trackConversion(eventName, params || {});
    } else {
      console.log("[track]", eventName, params || {});
    }
  } catch (e) {
    /* tracking must never break the page */
  }
}

export function enquiryWhatsAppUrl(project, d) {
  const lines = [
    `Hi, I am interested in ${project}.`,
    `Name: ${d.name || ""}`,
    `Mobile: ${d.phone || ""}`,
  ];
  if (d.email) lines.push(`Email: ${d.email}`);
  if (d.interest) lines.push(`Interested in: ${d.interest}`);
  if (d.message) lines.push(`Message: ${d.message}`);
  return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Send an enquiry through EmailJS. Resolves true on success, false on failure
// (the caller then falls back to WhatsApp so no lead is ever lost).
export async function sendEnquiryEmail(project, d) {
  const e = SITE_CONFIG.emailjs;
  try {
    const res = await fetch(e.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: e.serviceId,
        template_id: e.templateId,
        user_id: e.publicKey,
        template_params: {
          from_name: d.name || "",
          phone: d.phone || "",
          email: d.email || "",
          interest: d.interest || "",
          project,
          message: d.message || "",
          reply_to: d.email || "",
        },
      }),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
