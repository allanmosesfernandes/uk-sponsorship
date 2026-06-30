// Single source of truth for site-wide SEO/identity constants.
// The canonical origin can be overridden per-environment; falls back to the
// Vercel production URL, then the known deployment.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://uk-sponsorship-tracker.vercel.app")
).replace(/\/+$/, "");

export const SITE_NAME = "UK Visa Sponsor Checker";

export const SITE_DESCRIPTION =
  "Check whether a UK company holds a Worker sponsor licence and which visa routes it can sponsor. Data from the official gov.uk register of licensed sponsors.";

// Date the underlying gov.uk register data was last refreshed (ISO 8601).
// Used for sitemap lastModified.
export const DATA_LAST_UPDATED = "2026-06-05";
