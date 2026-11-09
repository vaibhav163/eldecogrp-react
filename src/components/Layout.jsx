import React, { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/projects.js";
import { DISCLAIMER, PHONE, WA } from "../config.js";
import { showToast } from "../lib/site.js";

export function Header() {
  return (
    <>
      {/* <div className="topbar">{DISCLAIMER}</div> */}
      <header className="site-header">
        <div className="wrap nav-row">
          <a className="brand" href="/">
            <img src="/assets/images/logo/eldeco-logo.png" alt="Eldeco Group" className="logo" width="2080" height="363" />
          </a>
          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/#projects">Projects</a>
            <a href="/areas/noida.html">Noida</a>
            <a href="/areas/greater-noida.html">Greater Noida</a>
            <a href="/areas/yamuna-expressway.html">Yamuna Expressway</a>
            <a href="/about.html">About Eldeco</a>
            <a href="/contact.html">Contact</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map(([label, url], i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} {...(last ? { "aria-current": "page" } : {})}>
              {url && !last ? <a href={url}>{label}</a> : label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    const onToast = (e) => {
      setMsg(e.detail || "");
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 4200);
    };
    window.addEventListener("app-toast", onToast);
    return () => window.removeEventListener("app-toast", onToast);
  }, []);
  return (
    <div id="toast" className="toast" role="status" aria-live="polite" hidden={!visible}>
      {msg}
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setShow(true);
    } catch (e) {
      setShow(true);
    }
  }, []);
  const setConsent = (v) => {
    try {
      localStorage.setItem("cookie-consent", JSON.stringify(v));
    } catch (e) {}
    setShow(false);
    showToast("Cookie preferences saved.");
  };
  return (
    <div id="cookie-banner" className="cookie-banner" hidden={!show}>
      <p>
        We use cookies to improve your experience and measure enquiries.{" "}
        <button
          id="cookie-prefs-btn"
          type="button"
          className="link-btn"
          onClick={() => setPrefsOpen(!prefsOpen)}
        >
          Preferences
        </button>
      </p>
      <div className="cookie-actions">
        <button
          id="cookie-accept"
          type="button"
          className="btn btn-primary"
          onClick={() => setConsent({ essential: true, analytics: true, marketing: true })}
        >
          Accept all
        </button>
        <button
          id="cookie-reject"
          type="button"
          className="btn"
          onClick={() => setConsent({ essential: true, analytics: false, marketing: false })}
        >
          Essential only
        </button>
      </div>
      <div id="cookie-prefs" hidden={!prefsOpen}>
        <label>
          <input type="checkbox" id="ck-analytics" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Analytics cookies
        </label>
        <label>
          <input type="checkbox" id="ck-marketing" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing cookies
        </label>
        <button
          id="cookie-save"
          type="button"
          className="btn btn-primary"
          onClick={() => setConsent({ essential: true, analytics, marketing })}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  const links1 = PROJECTS.slice(0, 11);
  const links2 = PROJECTS.slice(11);
  return (
    <>
      <footer className="site-footer">
        <div className="wrap foot-grid">
          <div>
            <img src="/assets/images/logo/eldeco-logo.png" alt="Eldeco Group" className="logo foot-logo" width="2080" height="363" />
            <p>Eldeco Group projects in Noida, Greater Noida &amp; Yamuna Expressway — enquire for price, availability, floor plans and site visits.</p>
            <p>
              <strong>Call / WhatsApp:</strong> <a href={`tel:+91${PHONE}`}>+91 {PHONE}</a>
            </p>
          </div>
          <div>
            <h4>Projects</h4>
            <ul>
              {links1.map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}.html`}>{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>More Projects</h4>
            <ul>
              {links2.map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}.html`}>{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about.html">About Eldeco Group</a></li>
              <li><a href="/contact.html">Contact Us</a></li>
              <li><a href="https://www.eldecogroup.com/" target="_blank" rel="noopener">Official Eldeco Group Website</a></li>
              <li><a href="https://www.up-rera.in/" target="_blank" rel="noopener">Verify RERA at up-rera.in</a></li>
            </ul>
          </div>
        </div>
        <div className="wrap foot-legal">
          <p>
            <strong>Disclaimer:</strong> {DISCLAIMER} All project details, images and RERA numbers on this site are sourced from the official Eldeco Group website (eldecogroup.com) and are for information only; they do not constitute an offer. Prices are on request. Please verify all details, including RERA registration, independently at up-rera.in before making any purchase decision.
          </p>
          <p>© 2026 eldecogrp.com — Authorized Channel Partner. All rights reserved.</p>
        </div>
      </footer>
      <div className="sticky-cta">
        <a href={`tel:+91${PHONE}`}>📞 Call Now</a>
        <a className="wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">💬 WhatsApp</a>
      </div>
      <div className="float-cta">
        <a className="fc-call" href={`tel:+91${PHONE}`} aria-label="Call us">📞</a>
        <a className="fc-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>
      </div>
      <CookieBanner />
      <Toast />
    </>
  );
}
