export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Small Business", href: "/services/small-business" },
      { label: "Personal Taxes", href: "/services/personal-taxes" },
      { label: "Outsourcing", href: "/services/outsourcing" },
      { label: "Allied Services", href: "/services/allied-services" },
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "Contact", href: "/contact" },
];

export const ctaNav = { label: "Book Online", href: "https://www.accountdynamics.com/book-online" };

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const footerGroups: FooterGroup[] = [
  {
    title: "Services",
    links: [
      { label: "Small Business", href: "/services/small-business" },
      { label: "Personal Taxes", href: "/services/personal-taxes" },
      { label: "Outsourcing", href: "/services/outsourcing" },
      { label: "Allied Services", href: "/services/allied-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Industries", href: "/industries" },
      { label: "Why Choose Us", href: "/why-choose-us" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Book Online", href: "https://www.accountdynamics.com/book-online" },
      { label: "Get a Free Quote", href: "/contact" },
    ],
  },
];
