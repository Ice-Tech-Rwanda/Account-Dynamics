export interface WhoWeServe {
  name: string;
  description: string;
  icon: string;
  services: string[];
}

export const whoWeServe: WhoWeServe[] = [
  {
    name: "Individuals",
    description:
      "Personal tax preparation, tax advisory, estate planning and guidance on tax savings such as the Lifetime Capital Gains Exemption.",
    icon: "User",
    services: ["Personal Tax Filing", "Tax Advisory", "Estate Planning", "Lifetime Capital Gains Exemption"],
  },
  {
    name: "Small Businesses",
    description:
      "Reliable bookkeeping, payroll, tax and compliance support so you always know where your business stands financially.",
    icon: "Store",
    services: ["Bookkeeping", "Payroll", "Tax Advisory", "Compilation Engagement Reports"],
  },
  {
    name: "Entrepreneurs",
    description:
      "Practical financial guidance and support for owners building and growing their ventures, from setup to strategic planning.",
    icon: "Rocket",
    services: ["Business Plans", "Tax Planning", "Cloud Accounting", "Advisory"],
  },
  {
    name: "Owner-Managed Businesses",
    description:
      "Comprehensive accounting, tax planning and advisory for owner-managed corporations across Canada.",
    icon: "Building2",
    services: ["Corporate Tax", "Payroll", "Bookkeeping", "Business Advisory"],
  },
  {
    name: "Accounting & CPA Firms",
    description:
      "Dependable bookkeeping, accounting and back-office outsourcing that lets your practice scale efficiently.",
    icon: "Briefcase",
    services: ["Bookkeeping Support", "Accounting Support", "Back-Office Support", "Scalability"],
  },
  {
    name: "Groups of Companies",
    description:
      "Scalable accounting and financial support for groups of companies, with flexibility to scale up or down as needed.",
    icon: "LayoutGrid",
    services: ["Corporate Group Outsourcing", "Consolidated Support", "Specialized Expertise"],
  },
];
