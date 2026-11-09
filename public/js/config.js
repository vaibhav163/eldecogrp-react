// ============ SITE CONFIG — edit everything from here ============
// Shipped static copy of the site config (the React bundle uses src/config.js;
// both carry the same values, including the EmailJS keys used for enquiries).
window.SITE_CONFIG = {
  siteName: "Eldeco Group Projects — Authorized Channel Partner",
  domain: "https://www.eldecogrp.com",
  phoneDisplay: "+91 8799756026",
  phoneIntl: "918799756026",          // WhatsApp / tel number for ALL leads
  whatsapp: "918799756026",
  emailjs: {
    serviceId: "service_fkmfynb",
    templateId: "template_bdjcyq6",
    publicKey: "xLfYDZXLlR6IeQ-C6"
  },
  ga4Id: "",                          // TODO: paste GA4 measurement ID (G-XXXXXXX)
  metaPixelId: "",                    // TODO: paste Meta Pixel ID
  // Central image map — replace any image by editing its path here / in assets/images/
  images: {
    logo: "/assets/images/logo/eldeco-logo.png",
    homeHero: "/assets/images/projects/eldeco-live-by-the-greens/hero.webp",
    completedBanner: "/assets/images/projects/completed-banner.webp"
  }
};
// Conversion tracking placeholder — fires only if IDs above are set.
window.trackConversion = function (eventName, params) {
  try {
    if (window.SITE_CONFIG.ga4Id && typeof gtag === "function") gtag("event", eventName, params || {});
    if (window.SITE_CONFIG.metaPixelId && typeof fbq === "function") fbq("track", eventName, params || {});
    console.log("[track]", eventName, params || {});
  } catch (e) {}
};
