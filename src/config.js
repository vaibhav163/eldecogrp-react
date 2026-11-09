// ============ SITE CONFIG — edit everything from here ============
export const SITE_CONFIG = {
  siteName: "Eldeco Group Projects — Authorized Channel Partner",
  domain: "https://www.eldecogrp.com",
  phoneDisplay: "+91 8799756026",
  phone: "8799756026",
  phoneIntl: "918799756026", // WhatsApp / tel number for ALL leads
  whatsapp: "918799756026",
  // EmailJS — enquiries are emailed via this service (fixed 2026-11-09).
  emailjs: {
    serviceId: "service_fkmfynb",
    templateId: "template_bdjcyq6",
    publicKey: "xLfYDZXLlR6IeQ-C6",
    apiUrl: "https://api.emailjs.com/api/v1.0/email/send",
  },
  ga4Id: "", // TODO: paste GA4 measurement ID (G-XXXXXXX)
  metaPixelId: "", // TODO: paste Meta Pixel ID
  // Central image map — replace any image by editing its path here / in assets/images/
  images: {
    logo: "/assets/images/logo/eldeco-logo.png",
    homeHero: "/assets/images/projects/eldeco-live-by-the-greens/hero.webp",
    completedBanner: "/assets/images/projects/completed-banner.webp",
  },
};

export const DOMAIN = SITE_CONFIG.domain;
export const PHONE = SITE_CONFIG.phone;
export const WA = SITE_CONFIG.whatsapp;
export const DISCLAIMER = "Authorized Channel Partner — this is not the official Eldeco Group website.";
