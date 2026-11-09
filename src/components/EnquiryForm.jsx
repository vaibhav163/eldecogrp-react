import React, { useRef, useState } from "react";
import { PHONE } from "../config.js";
import { enquiryWhatsAppUrl, sendEnquiryEmail, showToast, trackConversion } from "../lib/site.js";

// Enquiry form — submits through EmailJS so the lead arrives by email.
// If the email send fails, it falls back to opening WhatsApp with the same
// details (the site's original behaviour), so no enquiry is ever lost.
export default function EnquiryForm({ project = "", variant = "standard" }) {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const proj = variant === "proj";

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return;
    const form = formRef.current;
    const fd = new FormData(form);
    const projectName = project || "Eldeco Group Projects";
    const d = {
      name: (fd.get("name") || "").toString(),
      phone: (fd.get("phone") || "").toString(),
      email: (fd.get("email") || "").toString(),
      interest: (fd.get("interest") || "").toString(),
      message: (fd.get("message") || "").toString(),
    };
    setSending(true);
    const ok = await sendEnquiryEmail(projectName, d);
    if (ok) {
      trackConversion("generate_lead", { project: projectName });
      showToast("Thank you! Your enquiry has been sent — our team will contact you shortly.");
      form.reset();
    } else {
      trackConversion("generate_lead", { project: projectName });
      showToast("Couldn't send online — opening WhatsApp…");
      window.open(enquiryWhatsAppUrl(projectName, d), "_blank");
    }
    setSending(false);
  }

  const fields = (
    <>
      <label>
        Name
        <input type="text" name="name" required placeholder="Your name" autoComplete="name" />
      </label>
      <label>
        Mobile
        <input type="tel" name="phone" required pattern="[0-9+ -]{10,15}" placeholder="10-digit mobile number" autoComplete="tel" />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="Email (optional)" autoComplete="email" />
      </label>
      <label>
        Interested in
        <select name="interest" defaultValue="">
          <option value="">Select configuration</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
          <option>Penthouse / Duplex</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows="3" placeholder="I want price & availability details"></textarea>
      </label>
    </>
  );

  if (proj) {
    return (
      <form ref={formRef} className="enquiry-form p-form" data-project={project} onSubmit={onSubmit}>
        <div className="p-form-strip">Express Your Interest</div>
        <div className="p-form-body">
          <p className="form-sub">Get price, floor plans &amp; a site visit on WhatsApp.</p>
          {fields}
          <button type="submit" className="p-submit" disabled={sending}>
            {sending ? "Sending…" : "Send Enquiry →"}
          </button>
          <p className="form-note">Submitting sends your enquiry to us instantly. No spam, ever.</p>
        </div>
      </form>
    );
  }

  return (
    <form ref={formRef} className="enquiry-form" data-project={project} onSubmit={onSubmit}>
      <h3>Express Your Interest</h3>
      <p className="form-sub">Get price, floor plans &amp; a site visit on WhatsApp.</p>
      {fields}
      <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
        {sending ? "Sending…" : "Send Enquiry →"}
      </button>
      <p className="form-note">Submitting sends your enquiry to us instantly. No spam, ever.</p>
    </form>
  );
}
