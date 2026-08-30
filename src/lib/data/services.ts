export interface ServiceCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
  services: Service[];
}

export interface Service {
  name: string;
  description: string;
  benefits: string[];
  icon: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "small-business",
    title: "Small Business",
    description:
      "If you operate a small business in Canada, it is important to track all revenue streams and business expenses to make sure that you have enough cash on hand. Maintaining proper financial records helps you analyze the financial state of your business, prepare CRA taxes, and identify areas where you can reduce costs.",
    icon: "Building2",
    cta: "Talk to an Accountant",
    services: [
      {
        name: "Bookkeeping",
        description:
          "Accurate and timely bookkeeping to keep your financial records organized, ensuring you always know where your business stands.",
        icon: "BookOpen",
        benefits: [
          "Clean, up-to-date financial records",
          "Clear picture of cash flow and profitability",
          "Simplified CRA tax preparation",
        ],
      },
      {
        name: "Tax Advisory",
        description:
          "Expert guidance on corporate and personal tax matters, helping you understand your obligations and identify legitimate tax opportunities.",
        icon: "Calculator",
        benefits: [
          "Understand your corporate and personal tax obligations",
          "Identify legitimate savings opportunities",
          "Ongoing, year-round support",
        ],
      },
      {
        name: "Audits & Appeals",
        description:
          "Professional support during CRA audits and tax appeals, ensuring your interests are represented and outcomes are fair.",
        icon: "ShieldCheck",
        benefits: [
          "Expert representation before the CRA",
          "Clear communication throughout the process",
          "Reduced stress and administrative burden",
        ],
      },
      {
        name: "Compilation Engagement Reports",
        description:
          "Preparation of financial statements and compilation engagement reports that provide clarity on your business performance.",
        icon: "FileText",
        benefits: [
          "Professional financial statements",
          "Greater confidence for lenders and partners",
          "A clear baseline for planning and growth",
        ],
      },
      {
        name: "Historical Accounting & Compliance Catch-Up",
        description:
          "Bringing your financial records up to date when they have fallen behind, ensuring full compliance with Canadian tax requirements.",
        icon: "Clock",
        benefits: [
          "Restore order to overdue or incomplete records",
          "Regain full CRA compliance",
          "A clean starting point going forward",
        ],
      },
      {
        name: "Payroll",
        description:
          "Reliable payroll processing and management to keep your employees paid accurately and on time while meeting CRA requirements.",
        icon: "Wallet",
        benefits: [
          "Accurate and on-time employee payments",
          "CRA payroll remittance compliance",
          "Reduced administrative workload",
        ],
      },
      {
        name: "Corporate Restructuring",
        description:
          "Strategic guidance on restructuring your business to improve efficiency, reduce tax exposure and support long-term growth.",
        icon: "Building2",
        benefits: [
          "Improved operational efficiency",
          "Potential to reduce tax exposure",
          "A structure that supports long-term growth",
        ],
      },
    ],
  },
  {
    slug: "personal-taxes",
    title: "Personal Taxes",
    description:
      "Personal tax filing and planning services designed to help individuals meet their obligations, minimize their tax burden, and plan for the future with confidence.",
    icon: "User",
    cta: "Get Tax Assistance",
    services: [
      {
        name: "Personal Tax Filing",
        description:
          "Accurate and timely preparation of personal income tax returns, ensuring all eligible deductions and credits are claimed.",
        icon: "CheckCircle",
        benefits: [
          "Complete and accurate tax returns",
          "All eligible deductions and credits considered",
          "Filed correctly and on time",
        ],
      },
      {
        name: "Tax Advisory",
        description:
          "Professional guidance on personal tax matters, from year-round planning to understanding complex tax situations.",
        icon: "Lightbulb",
        benefits: [
          "Clarity on complex personal tax situations",
          "Year-round tax planning support",
          "Confidence in your tax decisions",
        ],
      },
      {
        name: "Estate Planning",
        description:
          "Strategic advice on estate and succession planning to help protect your assets and minimize tax implications for your beneficiaries.",
        icon: "Shield",
        benefits: [
          "Protect and organize your assets",
          "Reduce tax implications for beneficiaries",
          "Clear succession and estate strategy",
        ],
      },
      {
        name: "Lifetime Capital Gains Exemption",
        description:
          "Expert guidance on qualifying for and utilizing the lifetime capital gains exemption to reduce tax on the sale of qualified property.",
        icon: "TrendingUp",
        benefits: [
          "Understand your eligibility for the exemption",
          "Guidance on applying it to qualified property",
          "Reduced tax on qualifying dispositions",
        ],
      },
    ],
  },
  {
    slug: "outsourcing",
    title: "Outsourcing",
    description:
      "Outsourcing offers several benefits, including cost savings, access to specialized expertise, and increased efficiency. By outsourcing certain tasks or functions to external providers, companies can focus on their core competencies and strategic initiatives.",
    icon: "Globe",
    cta: "Discuss Outsourcing",
    services: [
      {
        name: "Accounting Firm Outsourcing",
        description:
          "Dependable bookkeeping, accounting and related back-office services for CPA and accounting offices looking to scale their operations.",
        icon: "Briefcase",
        benefits: [
          "Scale your practice without heavy hiring",
          "Reliable bookkeeping and accounting support",
          "Specialized expertise on demand",
        ],
      },
      {
        name: "Corporate Group Outsourcing",
        description:
          "Scalable accounting and financial support for groups of companies, providing flexibility in scaling operations up or down based on demand.",
        icon: "LayoutGrid",
        benefits: [
          "Flexible support that scales with your group",
          "Cost-conscious back-office outsourcing",
          "Specialized expertise across entities",
        ],
      },
    ],
  },
  {
    slug: "allied-services",
    title: "Allied Services",
    description:
      "Additional professional services designed to support your business beyond traditional accounting and tax preparation.",
    icon: "Handshake",
    cta: "Discuss Your Needs",
    services: [
      {
        name: "Financing & Business Plans",
        description:
          "Professional preparation of financial information and business plans for financing applications to financial institutions.",
        icon: "Clipboard",
        benefits: [
          "Well-prepared financing applications",
          "Professional business plans for lenders",
          "Stronger positioning with financial institutions",
        ],
      },
      {
        name: "QuickBooks Onboarding",
        description:
          "Expert help transitioning into and properly configuring QuickBooks-based accounting workflows for your business.",
        icon: "Rocket",
        benefits: [
          "Smooth transition to QuickBooks",
          "Properly configured accounting workflows",
          "Training and setup that fits your business",
        ],
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
