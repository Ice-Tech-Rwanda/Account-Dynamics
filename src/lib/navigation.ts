export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Rankings", href: "/rankings" },
  { label: "Shop", href: "/shop" },
  { label: "Resources", href: "/resources" },
  { label: "Join Us", href: "/join" },
];

export interface FooterGroup {
  title: string;
  links: NavItem[];
}

export const footerGroups: FooterGroup[] = [
  {
    title: "Club",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Rankings", href: "/rankings" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join Us", href: "/join" },
      { label: "Women & Youth", href: "/womens-youth" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Donate", href: "/support" },
      { label: "Sponsor Us", href: "/support" },
      { label: "Contact", href: "/about" },
    ],
  },
];
