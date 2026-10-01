import { siteConfig } from "@/lib/site";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "All Destinations", href: "/destinations" },
      { label: "Volcanoes National Park", href: "/destinations/volcanoes-national-park" },
      { label: "Akagera National Park", href: "/destinations/akagera-national-park" },
      { label: "Nyungwe National Park", href: "/destinations/nyungwe-national-park" },
      { label: "Lake Kivu", href: "/destinations/lake-kivu" },
      { label: "Kigali City", href: "/destinations/kigali-city" },
    ],
  },
  { label: "Tour Packages", href: "/tour-packages" },
  { label: "Services", href: "/services" },
  { label: "Training", href: "/training" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const ctaNav = { label: "Plan Your Trip", href: siteConfig.bookOnlineUrl };

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const footerGroups: FooterGroup[] = [
  {
    title: "Destinations",
    links: [
      { label: "Volcanoes National Park", href: "/destinations/volcanoes-national-park" },
      { label: "Akagera National Park", href: "/destinations/akagera-national-park" },
      { label: "Nyungwe National Park", href: "/destinations/nyungwe-national-park" },
      { label: "Lake Kivu", href: "/destinations/lake-kivu" },
      { label: "Kigali City", href: "/destinations/kigali-city" },
      { label: "All Destinations", href: "/destinations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about#team" },
      { label: "Mission & Values", href: "/mission-and-values" },
      { label: "Why Travel With Us", href: "/why-choose-us" },
      { label: "Gallery", href: "/gallery" },
      { label: "Travel Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Tours & Services",
    links: [
      { label: "Tour Packages", href: "/tour-packages" },
      { label: "Services", href: "/services" },
      { label: "Training & Internships", href: "/training" },
      { label: "Plan Your Trip", href: siteConfig.bookOnlineUrl },
      { label: "Tours & Experiences", href: "/services/tours-and-experiences" },
      { label: "Travel Services", href: "/services/travel-services" },
    ],
  },
];