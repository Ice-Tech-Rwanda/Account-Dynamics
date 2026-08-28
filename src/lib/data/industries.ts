export interface Industry {
  name: string;
  description: string;
  icon: string;
}

export const industries: Industry[] = [
  {
    name: "Small Businesses",
    description:
      "Tailored accounting, bookkeeping and tax services for small business owners who need reliable financial information to make informed decisions.",
    icon: "Store",
  },
  {
    name: "Entrepreneurs",
    description:
      "Financial guidance and planning support for entrepreneurs navigating the early stages of building and growing their ventures.",
    icon: "Rocket",
  },
  {
    name: "Owner-Managed Corporations",
    description:
      "Comprehensive corporate accounting, tax planning and advisory services for owner-managed corporations in Canada.",
    icon: "Building2",
  },
  {
    name: "Individuals",
    description:
      "Personal tax preparation, planning and advisory services to help individuals meet their obligations and optimize their tax position.",
    icon: "User",
  },
  {
    name: "CPA & Accounting Firms",
    description:
      "Dependable outsourcing and back-office support for CPA and accounting offices looking to scale their operations.",
    icon: "Briefcase",
  },
  {
    name: "Groups of Companies",
    description:
      "Scalable accounting and financial support for groups of companies, providing flexibility and specialized expertise.",
    icon: "LayoutGrid",
  },
];
