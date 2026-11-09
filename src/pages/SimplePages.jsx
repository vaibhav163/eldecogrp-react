import React from "react";
import { CONTENT } from "../data/content.js";
import { Header, Footer, Breadcrumbs } from "../components/Layout.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";

export function AboutPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[["Home", "/"], ["About Eldeco Group", ""]]} />
      <section>
        <div className="wrap">
          <h1>About Eldeco Group</h1>
          <div dangerouslySetInnerHTML={{ __html: CONTENT.about.bodyHtml }} />
        </div>
      </section>
      <Footer />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[["Home", "/"], ["Contact Us", ""]]} />
      <section>
        <div className="wrap">
          <h1>Contact Us</h1>
          <div dangerouslySetInnerHTML={{ __html: CONTENT.contact.preHtml }} />
          <div style={{ maxWidth: 520 }}>
            <EnquiryForm project="General Enquiry — Eldeco Projects" />
          </div>
          <div dangerouslySetInnerHTML={{ __html: CONTENT.contact.postHtml }} />
        </div>
      </section>
      <Footer />
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Header />
      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1>404 — Page Not Found</h1>
          <p>Oops, this page does not exist. Explore Eldeco Group projects in Noida, Greater Noida &amp; Yamuna Expressway instead.</p>
          <a className="btn btn-primary" href="/">Go to Home Page</a>{" "}
          <a className="btn" href="/#projects">View Projects</a>
        </div>
      </section>
      <Footer />
    </>
  );
}
