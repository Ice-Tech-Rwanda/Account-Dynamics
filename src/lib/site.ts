export const siteConfig = {
  name: "Global Line Safaris",
  shortName: "Global Line Safaris",
  initials: "GL",
  productName: "Global Line Safaris",
  version: "1.0.0",
  tagline: "Travel · Safaris · East Africa",
  titleTemplate: "%s | Global Line Safaris",
  description:
    "Global Line Safaris is a Rwanda-based travel company creating memorable safari and tour experiences across Rwanda and East Africa — wildlife safaris, gorilla trekking, cultural tours and lake escapes.",
  keywords: [
    "Rwanda safari",
    "gorilla trekking Rwanda",
    "Akagera National Park",
    "Volcanoes National Park",
    "Nyungwe Forest",
    "Lake Kivu",
    "Congo Nile Trail",
    "Global Line Safaris",
    "Rwanda tours",
    "East Africa travel",
    "Kigali city tour",
    "Rwanda tour packages",
    "wildlife safaris",
    "chimpanzee trekking",
    "cultural tours Rwanda",
  ],
  email: "info@globallinesafaris.rw",
  phone: "+250 793 885 400",
  phoneSecondary: "+250 793 885 400",
  // WhatsApp click-to-chat. International format (no "+", spaces, parentheses or hyphens).
  whatsappNumber: "250793885400",
  whatsapp: "https://wa.me/250793885400",
  whatsappMessage:
    "Hello Global Line Safaris, I would like to learn more about your safari and tour packages.",
  location: "KG 7 Ave, Kigali, Rwanda",
  hours: "Monday – Friday, 9:00 AM – 5:00 PM",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  bookOnlineUrl: "/plan-your-trip",
  socialLinks: [
    { label: "Facebook", href: "https://facebook.com/globallinesafaris" },
    { label: "X (Twitter)", href: "https://x.com/GlobaLine" },
    { label: "LinkedIn", href: "https://linkedin.com/in/global-line-safaris-0367a123a" },
    { label: "Instagram", href: "https://instagram.com/globallinesafaris1" },
  ],
} as const;

export const BOOKING_URL = siteConfig.bookOnlineUrl;
