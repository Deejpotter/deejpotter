/**
 * Places this site sends people. Kept in one file because the site has no
 * contact form or email address: every "get in touch" path ends at one of
 * these, so changing a handle or the business domain is a one-line edit.
 */
export const links = {
  github: "https://github.com/Deejpotter",
  linkedin: "https://www.linkedin.com/in/daniel-potter-5224a4119",
  // Paid work (websites, CAD, printing) is handled by the business, not here.
  lumendot: "https://lumendot.com",
  siteRepo: "https://github.com/Deejpotter/deejpotter",
} as const;
