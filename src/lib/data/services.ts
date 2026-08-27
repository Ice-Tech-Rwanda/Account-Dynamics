export interface ServiceCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  services: Service[];
}

export interface Service {
  name: string;
  description: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "small-business",
    title: "Small Business",
    description:
      "If you operate a small business in Canada, it is important to track all revenue streams and business expenses to make sure that you have enough cash on hand. Maintaining proper financial records helps you analyze the financial state of your business, prepare CRA taxes, and identify areas where you can reduce costs.",
    icon: "Building2",
    services: [
      {
        name: "Bookkeeping",
        description:
          "Accurate and timely bookkeeping to keep your financial records organized, ensuring you always know where your business stands.",
      },
      {
        name: "Tax Advisory",
        description:
          "Expert guidance on corporate and personal tax matters, helping you understand your obligations and identify legitimate tax opportunities.",
      },
      {
        name: "Audits & Appeals",
        description:
          "Professional support during CRA audits and tax appeals, ensuring your interests are represented and outcomes are fair.",
      },
      {
        name: "Compilation Engagement Reports",
        description:
          "Preparation of financial statements and compilation engagement reports that provide clarity on your business performance.",
      },
      {
        name: "Historical Accounting & Compliance Catch-Up",
        description:
          "Bringing your financial records up to date when they have fallen behind, ensuring full compliance with Canadian tax requirements.",
      },
      {
        name: "Payroll",
        description:
          "Reliable payroll processing and management to keep your employees paid accurately and on time while meeting CRA requirements.",
      },
      {
        name: "Corporate Restructuring",
        description:
          "Strategic guidance on restructuring your business to improve efficiency, reduce tax exposure and support long-term growth.",
      },
    ],
  },
  {
    slug: "personal-taxes",
    title: "Personal Taxes",
    description:
      "Personal tax filing and planning services designed to help individuals meet their obligations, minimize their tax burden, and plan for the future with confidence.",
    icon: "User",
    services: [
      {
        name: "Personal Tax Filing",
        description:
          "Accurate and timely preparation of personal income tax returns, ensuring all eligible deductions and credits are claimed.",
      },
      {
        name: "Tax Advisory",
        description:
          "Professional guidance on personal tax matters, from year-round planning to understanding complex tax situations.",
      },
      {
        name: "Estate Planning",
        description:
          "Strategic advice on estate and succession planning to help protect your assets and minimize tax implications for your beneficiaries.",
      },
      {
        name: "Lifetime Capital Gains Exemption",
        description:
          "Expert guidance on qualifying for and utilizing the lifetime capital gains exemption to reduce tax on the sale of qualified property.",
      },
    ],
  },
  {
    slug: "outsourcing",
    title: "Outsourcing",
    description:
      "Outsourcing offers several benefits, including cost savings, access to specialized expertise, and increased efficiency. By outsourcing certain tasks or functions to external providers, companies can focus on their core competencies and strategic initiatives.",
    icon: "Globe",
    services: [
      {
        name: "Accounting Firm Outsourcing",
        description:
          "Dependable bookkeeping, accounting and related back-office services for CPA and accounting offices looking to scale their operations.",
      },
      {
        name: "Corporate Group Outsourcing",
        description:
          "Scalable accounting and financial support for groups of companies, providing flexibility in scaling operations up or down based on demand.",
      },
    ],
  },
  {
    slug: "allied-services",
    title: "Allied Services",
    description:
      "Additional professional services designed to support your business beyond traditional accounting and tax preparation.",
    icon: "Handshake",
    services: [
      {
        name: "Financing & Business Plans",
        description:
          "Professional preparation of financial information and business plans for financing applications to financial institutions.",
      },
      {
        name: "QuickBooks Onboarding",
        description:
          "Expert help transitioning into and properly configuring QuickBooks-based accounting workflows for your business.",
      },
    ],
  },
];

export const serviceHighlights = [
  {
    title: "Tax",
    description: "Professional tax preparation, planning and advisory.",
    icon: "Calculator",
  },
  {
    title: "Cloud Accounting",
    description: "Modern, paperless accounting and financial reporting.",
    icon: "Cloud",
  },
  {
    title: "Advisory",
    description: "Practical financial and business guidance.",
    icon: "TrendingUp",
  },
  {
    title: "Business Data Analytics",
    description: "Turning financial data into useful business insights.",
    icon: "BarChart3",
  },
];
