/**
 * Centralized placeholder image configuration.
 *
 * These are temporary, professionally licensed placeholder images sourced from
 * Unsplash (https://unsplash.com — free to use; see their license). They make
 * the site look production-ready and are intentionally centralized here so the
 * client can replace any image without touching component code.
 *
 * To swap in official Account Dynamics images later:
 *   1. Add the files under /public (e.g. /images/hero.jpg).
 *   2. Update the corresponding value below to the local path (e.g. "/images/hero.jpg").
 *   3. Commit — every component already reads from this module.
 *
 * All URLs are served through next/image for automatic optimization.
 */

const base = "https://images.unsplash.com";

export interface SiteImage {
  src: string;
  alt: string;
}

export interface TeamAvatarEntry {
  name: string;
  initials: string;
  /** Set to a local /public path or remote URL to use a real photo; null shows initials. */
  src: string | null;
}

export interface SiteImages {
  heroSlides: SiteImage[];
  about: SiteImage;
  advisory: SiteImage;
  servicesHero: SiteImage;
  smallBusiness: SiteImage;
  personalTaxes: SiteImage;
  outsourcing: SiteImage;
  alliedServices: SiteImage;
  contact: SiteImage;
  team: {
    founder: TeamAvatarEntry;
    rishi: TeamAvatarEntry;
    amrit: TeamAvatarEntry;
    yogesh: TeamAvatarEntry;
    hari: TeamAvatarEntry;
    nikhil: TeamAvatarEntry;
  };
}

export const siteImages: SiteImages = {
  // Hero background slides (wide, landscape, work well behind a dark overlay)
  heroSlides: [
    {
      src: `${base}/photo-1497366754035-f200968a6e72`,
      alt: "Professional modern accounting office workspace at Account Dynamics",
    },
    {
      src: `${base}/photo-1554224155-6726b3ff858f`,
      alt: "Calculator and financial documents on a desk at Account Dynamics",
    },
    {
      src: `${base}/photo-1553877522-43269d4ea984`,
      alt: "Business consultant reviewing financial charts and reports",
    },
  ],

  // About section — accountant/business consulting with financial documents
  about: {
    src: `${base}/photo-1556761175-b413da4baf72`,
    alt: "Account Dynamics team collaborating on financial documents in a business meeting",
  },

  // Business advisory / financial analytics
  advisory: {
    src: `${base}/photo-1460925895917-afdab827c52f`,
    alt: "Laptop displaying business analytics and financial charts",
  },

  // Page-level hero backgrounds (services, service detail, contact)
  servicesHero: {
    src: `${base}/photo-1554774853-aae0a22c8aa4`,
    alt: "Business analytics and accounting reports in a professional environment",
  },

  // Service categories
  smallBusiness: {
    src: `${base}/photo-1522071820081-009f0129c71c`,
    alt: "Small business team collaborating in a professional consultation",
  },
  personalTaxes: {
    src: `${base}/photo-1554224155-6726b3ff858f`,
    alt: "Professional tax and financial planning documents and calculator",
  },
  outsourcing: {
    src: `${base}/photo-1521791136064-7986c2920216`,
    alt: "Professional accounting team collaborating on client work",
  },
  alliedServices: {
    src: `${base}/photo-1560472355-536de3962603`,
    alt: "Financial reports and business planning documents",
  },

  // Contact page supporting image
  contact: {
    src: `${base}/photo-1544717297-fa95b6ee9643`,
    alt: "Professional accounting consultation at a modern Toronto office",
  },

  // Team member avatars.
  // src is currently null → a tasteful initials placeholder is shown.
  // To use official Account Dynamics photos later, set src to a local path
  // (e.g. "/team/joseph-mathews.jpg") or a remote URL — no component changes needed.
  team: {
    founder: { name: "Joseph P. Mathews", initials: "JM", src: null },
    rishi: { name: "Rishi", initials: "R", src: null },
    amrit: { name: "Amrit", initials: "A", src: null },
    yogesh: { name: "Yogesh", initials: "Y", src: null },
    hari: { name: "Hari", initials: "H", src: null },
    nikhil: { name: "Nikhil", initials: "N", src: null },
  },
};
