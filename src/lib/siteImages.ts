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
  aboutPage: {
    heroBackground: SiteImage;
    office: SiteImage;
    teamCollaboration: SiteImage;
    finances: SiteImage;
    workspace: SiteImage;
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
  // src is a temporary internet portrait placeholder that the client will
  // replace later with official Account Dynamics photos. To swap in real
  // photos, just set src to a local path (e.g. "/team/joseph-mathews.jpg")
  // or another URL — no component changes needed.
  team: {
    founder: {
      name: "Joseph P. Mathews",
      initials: "JM",
      src: `${base}/photo-1560250097-0b93528c311a`,
    },
    rishi: {
      name: "Rishi",
      initials: "R",
      src: `${base}/photo-1507003211169-0a1dd7228f2d`,
    },
    amrit: {
      name: "Amrit",
      initials: "A",
      src: `${base}/photo-1472099645785-5658abf4ff4e`,
    },
    yogesh: {
      name: "Yogesh",
      initials: "Y",
      src: `${base}/photo-1519085360753-af0119f7cbe7`,
    },
    hari: {
      name: "Hari",
      initials: "H",
      src: `${base}/photo-1500648767791-00dcc994a43e`,
    },
    nikhil: {
      name: "Nikhil",
      initials: "N",
      src: `${base}/photo-1573496359142-b8d87734a5a2`,
    },
  },

  // About page illustration images (generic scenes — not portraits of named staff).
  // Used to enrich the About section with real, professional imagery.
  aboutPage: {
    heroBackground: {
      src: `${base}/photo-1551434678-e076c223a692`,
      alt: "Professional accounting team collaborating in a modern bright office",
    },
    office: {
      src: `${base}/photo-1524758631624-e2822e304c36`,
      alt: "Modern professional office meeting space at Account Dynamics",
    },
    teamCollaboration: {
      src: `${base}/photo-1542744173-8e7e53415bb0`,
      alt: "Account Dynamics team collaborating around a desk in the office",
    },
    finances: {
      src: `${base}/photo-1554224155-6726b3ff858f`,
      alt: "Financial documents and calculator on a desk at Account Dynamics",
    },
    workspace: {
      src: `${base}/photo-1497366754035-f200968a6e72`,
      alt: "Organized accounting workspace at Account Dynamics",
    },
  },
};
