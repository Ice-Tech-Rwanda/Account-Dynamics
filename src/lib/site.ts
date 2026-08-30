export const siteConfig = {
  name: "Account Dynamics",
  shortName: "Account Dynamics",
  initials: "AD",
  productName: "Account Dynamics",
  version: "1.0.0",
  tagline: "Tax | Cloud Accounting | Advisory | Business Data Analysts",
  titleTemplate: "%s | Account Dynamics",
  description:
    "Account Dynamics provides professional accounting, tax, advisory and business analytics services to individuals, entrepreneurs and small businesses in Toronto, Canada. Helping clients understand their financial information, remain compliant and make better business decisions.",
  keywords: [
    "accounting services Toronto",
    "tax advisory Canada",
    "small business accounting",
    "personal tax filing",
    "cloud accounting",
    "bookkeeping services",
    "payroll services",
    "business advisory",
    "CRA compliance",
    "tax planning",
    "outsourcing accounting",
    "QuickBooks setup",
    "financial reporting",
    "business analytics",
    "compilation engagement reports",
  ],
  email: "info@accountdynamics.com",
  phone: "416-748-2042",
  phoneSecondary: "416-450-5639",
  // WhatsApp click-to-chat. The number is the international format equivalent of
  // the phone SMS/WhatsApp line (no "+", spaces, parentheses or hyphens).
  whatsappNumber: "14167482042",
  whatsapp: "https://wa.me/14167482042",
  // Default pre-filled message for WhatsApp click-to-chat.
  // Context-aware messages per page are defined in the FloatingWhatsApp component.
  whatsappMessage:
    "Hello Account Dynamics, I would like to learn more about your accounting and advisory services.",
  location: "55 Baywood Road, 2nd Floor, Toronto, Ontario M9V 3Y8",
  hours: "Monday – Friday, 9:00 AM – 4:00 PM",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  bookOnlineUrl: "/book",
  socialLinks: [
    { label: "LinkedIn", href: "#" },
  ],
} as const;

export const BOOKING_URL = siteConfig.bookOnlineUrl;
