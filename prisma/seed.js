/**
 * Account Dynamics — Database Seed Script
 *
 * Seeds the database with 100% verified, real Account Dynamics content.
 * Run: npm run db:seed
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Account Dynamics database with full verified data...\n");

  // -----------------------------------------------------------------------
  // 1. Admin User
  // -----------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@accountdynamics.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "SUPER_ADMIN",
      active: true,
    },
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      active: true,
    },
  });
  console.log(`✅ Super Admin user: ${admin.email} (${admin.role})`);

  // -----------------------------------------------------------------------
  // 2. Service Categories, Services & Service Benefits
  // -----------------------------------------------------------------------
  const categories = [
    {
      slug: "small-business",
      title: "Small Business",
      description:
        "If you operate a small business in Canada, it is important to track all revenue streams and business expenses to make sure that you have enough cash on hand. Maintaining proper financial records helps you analyze the financial state of your business, prepare CRA taxes, and identify areas where you can reduce costs.",
      icon: "Building2",
      cta: "Talk to an Accountant",
      displayOrder: 1,
      services: [
        {
          name: "Bookkeeping",
          slug: "bookkeeping",
          description:
            "Accurate and timely bookkeeping to keep your financial records organized, ensuring you always know where your business stands.",
          icon: "BookOpen",
          displayOrder: 1,
          benefits: [
            "Clean, up-to-date financial records",
            "Clear picture of cash flow and profitability",
            "Simplified CRA tax preparation",
          ],
        },
        {
          name: "Tax Advisory",
          slug: "tax-advisory",
          description:
            "Expert guidance on corporate and personal tax matters, helping you understand your obligations and identify legitimate tax opportunities.",
          icon: "Calculator",
          displayOrder: 2,
          benefits: [
            "Understand your corporate and personal tax obligations",
            "Identify legitimate savings opportunities",
            "Ongoing, year-round support",
          ],
        },
        {
          name: "Audits & Appeals",
          slug: "audits-appeals",
          description:
            "Professional support during CRA audits and tax appeals, ensuring your interests are represented and outcomes are fair.",
          icon: "ShieldCheck",
          displayOrder: 3,
          benefits: [
            "Expert representation before the CRA",
            "Clear communication throughout the process",
            "Reduced stress and administrative burden",
          ],
        },
        {
          name: "Compilation Engagement Reports",
          slug: "compilation-engagement-reports",
          description:
            "Preparation of financial statements and compilation engagement reports that provide clarity on your business performance.",
          icon: "FileText",
          displayOrder: 4,
          benefits: [
            "Professional financial statements",
            "Greater confidence for lenders and partners",
            "A clear baseline for planning and growth",
          ],
        },
        {
          name: "Historical Accounting & Compliance Catch-Up",
          slug: "historical-accounting",
          description:
            "Bringing your financial records up to date when they have fallen behind, ensuring full compliance with Canadian tax requirements.",
          icon: "Clock",
          displayOrder: 5,
          benefits: [
            "Restore order to overdue or incomplete records",
            "Regain full CRA compliance",
            "A clean starting point going forward",
          ],
        },
        {
          name: "Payroll",
          slug: "payroll",
          description:
            "Reliable payroll processing and management to keep your employees paid accurately and on time while meeting CRA requirements.",
          icon: "Wallet",
          displayOrder: 6,
          benefits: [
            "Accurate and on-time employee payments",
            "CRA payroll remittance compliance",
            "Reduced administrative workload",
          ],
        },
        {
          name: "Corporate Restructuring",
          slug: "corporate-restructuring",
          description:
            "Strategic guidance on restructuring your business to improve efficiency, reduce tax exposure and support long-term growth.",
          icon: "Building2",
          displayOrder: 7,
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
      displayOrder: 2,
      services: [
        {
          name: "Personal Tax Filing",
          slug: "personal-tax-filing",
          description:
            "Accurate and timely preparation of personal income tax returns, ensuring all eligible deductions and credits are claimed.",
          icon: "CheckCircle",
          displayOrder: 1,
          benefits: [
            "Complete and accurate tax returns",
            "All eligible deductions and credits considered",
            "Filed correctly and on time",
          ],
        },
        {
          name: "Tax Advisory",
          slug: "personal-tax-advisory",
          description:
            "Professional guidance on personal tax matters, from year-round planning to understanding complex tax situations.",
          icon: "Lightbulb",
          displayOrder: 2,
          benefits: [
            "Clarity on complex personal tax situations",
            "Year-round tax planning support",
            "Confidence in your tax decisions",
          ],
        },
        {
          name: "Estate Planning",
          slug: "estate-planning",
          description:
            "Strategic advice on estate and succession planning to help protect your assets and minimize tax implications for your beneficiaries.",
          icon: "Shield",
          displayOrder: 3,
          benefits: [
            "Protect and organize your assets",
            "Reduce tax implications for beneficiaries",
            "Clear succession and estate strategy",
          ],
        },
        {
          name: "Lifetime Capital Gains Exemption",
          slug: "capital-gains-exemption",
          description:
            "Expert guidance on qualifying for and utilizing the lifetime capital gains exemption to reduce tax on the sale of qualified property.",
          icon: "TrendingUp",
          displayOrder: 4,
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
      displayOrder: 3,
      services: [
        {
          name: "Accounting Firm Outsourcing",
          slug: "accounting-firm-outsourcing",
          description:
            "Dependable bookkeeping, accounting and related back-office services for CPA and accounting offices looking to scale their operations.",
          icon: "Briefcase",
          displayOrder: 1,
          benefits: [
            "Scale your practice without heavy hiring",
            "Reliable bookkeeping and accounting support",
            "Specialized expertise on demand",
          ],
        },
        {
          name: "Corporate Group Outsourcing",
          slug: "corporate-group-outsourcing",
          description:
            "Scalable accounting and financial support for groups of companies, providing flexibility in scaling operations up or down based on demand.",
          icon: "LayoutGrid",
          displayOrder: 2,
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
      displayOrder: 4,
      services: [
        {
          name: "Financing & Business Plans",
          slug: "financing-business-plans",
          description:
            "Professional preparation of financial information and business plans for financing applications to financial institutions.",
          icon: "Clipboard",
          displayOrder: 1,
          benefits: [
            "Well-prepared financing applications",
            "Professional business plans for lenders",
            "Stronger positioning with financial institutions",
          ],
        },
        {
          name: "QuickBooks Onboarding",
          slug: "quickbooks-onboarding",
          description:
            "Expert help transitioning into and properly configuring QuickBooks-based accounting workflows for your business.",
          icon: "Rocket",
          displayOrder: 2,
          benefits: [
            "Smooth transition to QuickBooks",
            "Properly configured accounting workflows",
            "Training and setup that fits your business",
          ],
        },
      ],
    },
  ];

  for (const catData of categories) {
    const { services, ...catFields } = catData;
    const category = await prisma.serviceCategory.upsert({
      where: { slug: catFields.slug },
      update: catFields,
      create: catFields,
    });

    for (const svcData of services) {
      const { benefits, displayOrder, ...svcFields } = svcData;
      const service = await prisma.service.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: svcData.slug } },
        update: { ...svcFields, displayOrder },
        create: { ...svcFields, categoryId: category.id, displayOrder },
      });

      // Clear & re-seed benefits
      await prisma.serviceBenefit.deleteMany({ where: { serviceId: service.id } });
      if (benefits && benefits.length) {
        for (let i = 0; i < benefits.length; i++) {
          await prisma.serviceBenefit.create({
            data: {
              serviceId: service.id,
              text: benefits[i],
              displayOrder: i + 1,
            },
          });
        }
      }
    }
    console.log(`✅ Category: ${catFields.title} (${services.length} services with benefits)`);
  }

  // -----------------------------------------------------------------------
  // 3. Team Members
  // -----------------------------------------------------------------------
  const teamMembers = [
    {
      id: "joseph-p-mathews",
      name: "Joseph P. Mathews",
      role: "Founder, CEO & CFO",
      bio: "Joseph Mathews is a Registered Professional Accountant and a member of the Society of Professional Accountants of Canada. He is also a Certified Accounting Practitioner and has successfully completed the 2-year CICA In-depth Tax Course, qualifying as a Tax Specialist from the Institute of Chartered Accountants of Canada (now Chartered Professional Accountants of Ontario). Joseph holds associate memberships with the National Association of Certified Valuation Analysts (CVA), Institute of Certified Management Accountants ANZ (CMA & CGBA), Institute of Certified Public Accountants of Rwanda (CPA), American Institute of Certified Public Accountants, CPA Australia, The Institute of Chartered Accountants of India (CA), and The Institute of Cost Accountants of India (CMA).",
      photo: "/team/joseph-mathews.jpg",
      isFounder: true,
      expertise: [
        "Bookkeeping & Accounting",
        "Financial Statement Preparation",
        "Compilation Engagement Reports",
        "Personal & Corporate Tax Returns",
        "Business Plans for Financing",
        "Tax Planning & Minimization",
        "CRA Tax Audits & Appeals",
      ],
      displayOrder: 1,
    },
    {
      id: "rishi",
      name: "Rishi",
      role: "Manager",
      bio: "Rishi has been a valuable member of the team since 2014. With a background in hospitality and over 2 years of study and work experience from London, UK, Rishi brings a unique perspective to analyzing businesses and their specific bookkeeping and accounting requirements. His business family background further enhances his ability to understand the distinct needs of our clients.",
      photo: "/team/rishi.jpg",
      isFounder: false,
      expertise: ["Business Analytics", "CRA Audits", "Client On-boarding", "Business Plans", "Business Processes"],
      displayOrder: 2,
    },
    {
      id: "amrit",
      name: "Amrit",
      role: "Office Manager",
      bio: "Amrit has been with Joseph Mathews & Associates Inc since 2002 and currently with Account Dynamics Inc. She is a Certified ProAdvisor (QuickBooks) with a Bachelor of Arts Degree and Business Administration and Tax and Accounting Diploma from Toronto School of Business. With over 20 years of experience in corporation and personal tax returns and all statutory filing requirements per the Canada Revenue Agency (CRA), Amrit coordinates and follows up for information and documents between clients, the India office and Toronto office.",
      photo: "/team/amrit.jpg",
      isFounder: false,
      expertise: ["QuickBooks ProAdvisor", "Corporate Tax Returns", "Personal Tax Returns", "CRA Compliance"],
      displayOrder: 3,
    },
    {
      id: "yogesh",
      name: "Yogesh",
      role: "Accounts Supervisor",
      bio: "Yogesh is a Certified ProAdvisor (QuickBooks) with a Master's Degree in Commerce and Bachelor's degree in Indian Laws from India. He has around 12 years of experience in bookkeeping, accounting and tax preparations.",
      photo: "/team/yogesh.jpg",
      isFounder: false,
      expertise: ["Bookkeeping", "Accounting", "Tax Preparations", "QuickBooks ProAdvisor"],
      displayOrder: 4,
    },
    {
      id: "hari",
      name: "Hari",
      role: "Bookkeeping & Payroll Supervisor",
      bio: "A dedicated professional with over 30 years of diverse work experience. As a Bookkeeping Supervisor and Payroll Specialist, he excels in providing exceptional services to Canadian clients. Through daily client engagement and collaboration with the onshore team, Hari maintains strong relationships and upholds data security.",
      photo: "/team/hari.jpg",
      isFounder: false,
      expertise: ["Bookkeeping", "Payroll", "QuickBooks", "Client Relations", "Data Security"],
      displayOrder: 5,
    },
    {
      id: "nikhil",
      name: "Nikhil",
      role: "IT",
      bio: "Results-driven UI/UX designer with experience in creating intuitive and visually appealing interfaces. Proficient in HTML, CSS, JavaScript, React, Node.js, and PostgreSQL, bringing a solid technical foundation to design projects.",
      photo: "/team/nikhil.jpg",
      isFounder: false,
      expertise: ["UI/UX Design", "Web Development", "React", "Node.js"],
      displayOrder: 6,
    },
  ];

  for (const member of teamMembers) {
    const { expertise, ...fields } = member;
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: { ...fields, expertise: JSON.stringify(expertise), status: "PUBLISHED" },
      create: {
        ...fields,
        expertise: JSON.stringify(expertise),
        status: "PUBLISHED",
      },
    });
  }
  console.log(`✅ Team: ${teamMembers.length} verified members`);

  // -----------------------------------------------------------------------
  // 4. Industries & Audiences
  // -----------------------------------------------------------------------
  const industries = [
    {
      name: "Small Businesses",
      slug: "small-businesses",
      description: "From sole proprietors to growing companies, we provide accounting, tax and advisory services tailored to small business needs.",
      icon: "Store",
      services: ["Bookkeeping", "Tax Preparation", "Financial Reporting", "Payroll"],
      displayOrder: 1,
    },
    {
      name: "Individuals",
      slug: "individuals",
      description: "Personal tax preparation, tax advisory, estate planning and guidance on tax savings such as the Lifetime Capital Gains Exemption.",
      icon: "User",
      services: ["Personal Tax Filing", "Tax Advisory", "Estate Planning", "Lifetime Capital Gains Exemption"],
      displayOrder: 2,
    },
    {
      name: "Entrepreneurs",
      slug: "entrepreneurs",
      description: "Practical financial guidance and support for owners building and growing their ventures, from setup to strategic planning.",
      icon: "Rocket",
      services: ["Business Plans", "Tax Planning", "Cloud Accounting", "Advisory"],
      displayOrder: 3,
    },
    {
      name: "Owner-Managed Businesses",
      slug: "owner-managed",
      description: "Comprehensive accounting, tax planning and advisory for owner-managed corporations across Canada.",
      icon: "Building2",
      services: ["Corporate Tax", "Payroll", "Bookkeeping", "Business Advisory"],
      displayOrder: 4,
    },
    {
      name: "Accounting & CPA Firms",
      slug: "cpa-firms",
      description: "Dependable bookkeeping, accounting and back-office outsourcing that lets your practice scale efficiently.",
      icon: "Briefcase",
      services: ["Bookkeeping Support", "Accounting Support", "Back-Office Support", "Scalability"],
      displayOrder: 5,
    },
    {
      name: "Groups of Companies",
      slug: "groups-of-companies",
      description: "Scalable accounting and financial support for groups of companies, with flexibility to scale up or down as needed.",
      icon: "LayoutGrid",
      services: ["Corporate Group Outsourcing", "Consolidated Support", "Specialized Expertise"],
      displayOrder: 6,
    },
  ];

  for (const industry of industries) {
    const { services: svcList, ...fields } = industry;
    await prisma.industry.upsert({
      where: { slug: fields.slug },
      update: { ...fields, services: JSON.stringify(svcList), status: "PUBLISHED" },
      create: { ...fields, services: JSON.stringify(svcList), status: "PUBLISHED" },
    });
  }
  console.log(`✅ Industries: ${industries.length} verified sectors`);

  // -----------------------------------------------------------------------
  // 5. FAQs
  // -----------------------------------------------------------------------
  const faqs = [
    { question: "What services does Account Dynamics offer?", answer: "Account Dynamics provides a full range of accounting services including bookkeeping, personal and corporate tax preparation, payroll, financial reporting, business advisory, cloud accounting setup and business analytics.", category: "General", displayOrder: 1 },
    { question: "How do I get started with Account Dynamics?", answer: "Simply contact us through our website or call us to schedule a free initial consultation. We'll discuss your needs and create a customized plan for your accounting and tax requirements.", category: "General", displayOrder: 2 },
    { question: "Do you work with clients outside of Toronto?", answer: "Yes, while we are based in Toronto, Ontario, we serve clients across Canada. Many of our services can be provided remotely using modern cloud-based accounting tools.", category: "General", displayOrder: 3 },
    { question: "What accounting software do you use?", answer: "We work with major cloud accounting platforms including QuickBooks Online, Xero, Wave and Sage. We help clients choose the right platform for their needs and provide setup, training and ongoing support.", category: "Technology", displayOrder: 4 },
    { question: "How much do your services cost?", answer: "Our pricing depends on the scope and complexity of the services you need. We offer competitive rates and transparent pricing. Contact us for a free consultation and quote tailored to your specific requirements.", category: "Pricing", displayOrder: 5 },
    { question: "Can you help with CRA audits or reviews?", answer: "Yes, we provide comprehensive support with CRA notices, reviews, audits and voluntary disclosures. Our team has extensive experience dealing with the CRA on behalf of our clients.", category: "Tax", displayOrder: 6 },
    { question: "What is a compilation engagement?", answer: "A compilation engagement involves preparing financial statements based on information provided by management, without performing any audit or review procedures. It's suitable for internal use or when financial statements are needed for lenders or other third parties.", category: "Services", displayOrder: 7 },
    { question: "Do you offer virtual CFO services?", answer: "Yes, our Virtual CFO service provides part-time CFO-level financial leadership including budgeting, forecasting, cash flow management and strategic financial advice — at a fraction of the cost of a full-time CFO.", category: "Services", displayOrder: 8 },
  ];

  await prisma.faqItem.deleteMany();
  for (const faq of faqs) {
    await prisma.faqItem.create({ data: { ...faq, status: "PUBLISHED" } });
  }
  console.log(`✅ FAQs: ${faqs.length} entries`);

  // -----------------------------------------------------------------------
  // 6. Settings
  // -----------------------------------------------------------------------
  const settings = {
    companyName: "Account Dynamics",
    shortName: "Account Dynamics",
    tagline: "Tax | Cloud Accounting | Advisory | Business Data Analysts",
    description: "Professional tax, cloud accounting, bookkeeping and advisory for individuals and small businesses across Canada.",
    email: "info@accountdynamics.com",
    phone: "416-748-2042",
    phoneSecondary: "416-450-5639",
    addressLine1: "55 Baywood Road, 2nd Floor",
    addressLine2: "Toronto, Ontario M9V 3Y8",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M9V 3Y8",
    country: "Canada",
    businessHoursLine1: "Monday – Friday",
    businessHoursLine2: "9:00 AM – 4:00 PM",
    whatsappNumber: "14167482042",
    whatsappMessage: "Hello Account Dynamics, I would like to learn more about your accounting and advisory services.",
    bookingUrl: "/book",
    copyright: "© 2026 Account Dynamics. All rights reserved.",
    designerCredit: "Ice Tech Rwanda",
    adminEmail: "info@accountdynamics.com",
    linkedin: "#",
    facebook: "#",
    instagram: "#",
    youtube: "#",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✅ Settings: ${Object.keys(settings).length} entries`);

  // -----------------------------------------------------------------------
  // 7. Homepage Sections
  // -----------------------------------------------------------------------
  const homepageSections = [
    {
      sectionKey: "hero",
      eyebrow: "Helping You Reach Your Financial Goals",
      title: "Turn your numbers into smarter decisions.",
      subtitle: "Professional tax, cloud accounting, bookkeeping and advisory for individuals and small businesses across Canada.",
      ctaLabel: "Book a Free Consultation",
      ctaUrl: "/book",
    },
    {
      sectionKey: "services",
      eyebrow: "Our Services",
      title: "Comprehensive Accounting Solutions",
      subtitle: "From day-to-day bookkeeping to strategic tax planning, we provide the full spectrum of accounting services your business needs.",
      items: JSON.stringify([
        { icon: "Calculator", title: "Tax", description: "Professional tax preparation, planning and advisory." },
        { icon: "Cloud", title: "Cloud Accounting", description: "Modern, paperless accounting and financial reporting." },
        { icon: "TrendingUp", title: "Advisory", description: "Practical financial and business guidance." },
        { icon: "BarChart3", title: "Business Data Analytics", description: "Turning financial data into useful business insights." },
      ]),
    },
    {
      sectionKey: "advisory",
      eyebrow: "Business Advisory",
      title: "Turn Financial Data Into Better Business Decisions",
      subtitle: "We help business owners move beyond basic bookkeeping by using financial information to identify patterns, understand costs, plan ahead and make informed decisions.",
      ctaLabel: "Learn More",
      ctaUrl: "/why-choose-us",
    },
    {
      sectionKey: "about",
      eyebrow: "About Account Dynamics",
      title: "Accounting Expertise You Can Rely On",
      subtitle: "Account Dynamics is a Canadian accounting, tax, advisory and business analytics firm in Toronto. We combine professional accounting expertise with modern cloud technology and a client-centered approach to help individuals and small businesses understand their numbers and make confident decisions.",
      ctaLabel: "Meet Our Team",
      ctaUrl: "/about",
    },
    {
      sectionKey: "whyChoose",
      eyebrow: "Why Choose Us",
      title: "Why Clients Trust Account Dynamics",
      subtitle: "We combine professional expertise with personalized service and modern technology to deliver results that matter.",
      ctaLabel: "Learn Why",
      ctaUrl: "/why-choose-us",
      items: JSON.stringify([
        { icon: "Award", title: "Professional Expertise", description: "Experienced accounting and tax professionals with decades of combined experience in Canadian tax law, corporate accounting and business advisory." },
        { icon: "Users", title: "Personalized Service", description: "Solutions designed around each client's unique business and financial situation." },
        { icon: "Cloud", title: "Technology-Enabled", description: "Modern cloud-based and paperless accounting workflows." },
        { icon: "ShieldCheck", title: "Tax & Compliance", description: "Support with tax preparation, planning and CRA compliance." },
        { icon: "BarChart3", title: "Business Insight", description: "Financial data used to help clients understand their businesses." },
        { icon: "Wallet", title: "Cost-Conscious", description: "Practical and cost-effective advisory for entrepreneurs and small businesses." },
        { icon: "Cpu", title: "Digital Transformation", description: "A forward-thinking approach to applying business analytics and modern accounting technology." },
        { icon: "TrendingUp", title: "Growth Partnership", description: "We grow with our clients, providing scalable services that adapt as your business evolves." },
      ]),
    },
    {
      sectionKey: "whoWeServe",
      eyebrow: "Who We Serve",
      title: "Accounting Support Built Around Your Needs",
      subtitle: "We tailor our accounting, tax and advisory services to the clients we serve — from individuals to groups of companies.",
      ctaLabel: "Explore Who We Serve",
      ctaUrl: "/industries",
    },
    {
      sectionKey: "technology",
      eyebrow: "Technology",
      title: "Technology That Makes Accounting Simpler",
      subtitle: "We use modern accounting technology and cloud-based, paperless workflows so your financial information is organized, accessible and easy to understand.",
      ctaLabel: "Explore Our Approach",
      ctaUrl: "/why-choose-us",
    },
    {
      sectionKey: "faq",
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Answers to the questions we hear most from individuals and small business owners.",
    },
    {
      sectionKey: "finalCta",
      eyebrow: "Get Started Today",
      title: "Ready to Take Control of Your Finances?",
      subtitle: "Whether you need tax preparation, bookkeeping, or strategic business advisory, our team is here to help you succeed.",
      ctaLabel: "Book a Free Consultation",
      ctaUrl: "/book",
    },
  ];

  for (const section of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: section,
      create: section,
    });
  }
  console.log(`✅ Homepage: ${homepageSections.length} sections`);

  // -----------------------------------------------------------------------
  // 8. SEO Settings
  // -----------------------------------------------------------------------
  const seoSettings = [
    { pageKey: "home", title: "Account Dynamics | Tax, Accounting & Business Advisory Toronto", description: "Professional tax, cloud accounting, bookkeeping and advisory services for individuals and small businesses in Toronto, Canada.", indexable: true },
    { pageKey: "about", title: "About Us | Account Dynamics", description: "Learn about Account Dynamics — a Canadian accounting, tax, advisory and business analytics firm founded by Joseph P. Mathews.", indexable: true },
    { pageKey: "services", title: "Services | Account Dynamics", description: "Explore the full range of accounting, tax, advisory and business analytics services offered by Account Dynamics in Toronto.", indexable: true },
    { pageKey: "industries", title: "Industries | Account Dynamics", description: "Industries served by Account Dynamics — small businesses, professionals, startups and more.", indexable: true },
    { pageKey: "contact", title: "Contact Us | Account Dynamics", description: "Get in touch with Account Dynamics for accounting, tax, advisory and business analytics services in Toronto.", indexable: true },
    { pageKey: "why-choose-us", title: "Why Choose Us | Account Dynamics", description: "Why clients trust Account Dynamics for their accounting, tax and business advisory needs.", indexable: true },
    { pageKey: "book", title: "Book a Consultation | Account Dynamics", description: "Book a free consultation with Account Dynamics for accounting, tax and business advisory services.", indexable: true },
  ];

  for (const seo of seoSettings) {
    await prisma.seoSetting.upsert({
      where: { pageKey: seo.pageKey },
      update: seo,
      create: seo,
    });
  }
  console.log(`✅ SEO: ${seoSettings.length} pages`);

  // -----------------------------------------------------------------------
  // 9. Software Tools
  // -----------------------------------------------------------------------
  const softwareTools = [
    { name: "QuickBooks Online", description: "Cloud-based accounting software for small businesses with automated invoicing, expense tracking, and CRA-compliant reports.", websiteUrl: "https://quickbooks.intuit.com", displayOrder: 1 },
    { name: "Xero", description: "Beautiful cloud accounting software for small businesses with real-time bank feeds and collaboration.", websiteUrl: "https://www.xero.com", displayOrder: 2 },
    { name: "Wave", description: "Free accounting and invoicing software built specifically for freelancers, consultants, and sole proprietors.", websiteUrl: "https://www.waveapps.com", displayOrder: 3 },
    { name: "Sage", description: "Robust business management and payroll software for growing enterprises.", websiteUrl: "https://www.sage.com", displayOrder: 4 },
  ];

  await prisma.softwareTool.deleteMany();
  for (const tool of softwareTools) {
    await prisma.softwareTool.create({ data: { ...tool, status: "PUBLISHED" } });
  }
  console.log(`✅ Software Tools: ${softwareTools.length} entries`);

  // -----------------------------------------------------------------------
  // 10. Membership Overview
  // -----------------------------------------------------------------------
  const existingMembership = await prisma.membership.findFirst();
  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        title: "Predictable Pricing, Exceptional Value",
        description: "Account Dynamics offers membership plans designed to provide affordable, predictable accounting, payroll, and tax support instead of relying on unexpected hourly billing.",
        ctaLabel: "Explore Membership Options",
        ctaUrl: "/book",
        benefits: JSON.stringify([
          "Dedicated Accounting Specialist",
          "Monthly Bookkeeping & Reconciliation",
          "Year-Round Tax Advisory & CRA Support",
          "Predictable Flat Monthly Fee",
        ]),
        status: "PUBLISHED",
      },
    });
    console.log("✅ Membership overview created");
  }

  // -----------------------------------------------------------------------
  // 11. Site Images
  // -----------------------------------------------------------------------
  const base = "https://images.unsplash.com";
  const siteImages = [
    { key: "hero.1", url: `${base}/photo-1497366754035-f200968a6e72`, alt: "Professional modern accounting office workspace" },
    { key: "hero.2", url: `${base}/photo-1554224155-6726b3ff858f`, alt: "Calculator and financial documents on a desk" },
    { key: "hero.3", url: `${base}/photo-1553877522-43269d4ea984`, alt: "Business consultant reviewing financial charts" },
    { key: "about", url: `${base}/photo-1556761175-b413da4baf72`, alt: "Account Dynamics team collaborating on financial documents" },
    { key: "advisory", url: `${base}/photo-1460925895917-afdab827c52f`, alt: "Laptop displaying business analytics and financial charts" },
    { key: "servicesHero", url: `${base}/photo-1554774853-aae0a22c8aa4`, alt: "Business analytics and accounting reports" },
    { key: "contact", url: `${base}/photo-1544717297-fa95b6ee9643`, alt: "Professional accounting consultation" },
    { key: "category.small-business", url: `${base}/photo-1522071820081-009f0129c71c`, alt: "Small business team collaborating" },
    { key: "category.personal-taxes", url: `${base}/photo-1554224155-6726b3ff858f`, alt: "Professional tax and financial planning documents" },
    { key: "category.outsourcing", url: `${base}/photo-1521791136064-7986c2920216`, alt: "Professional accounting team collaborating" },
    { key: "category.allied-services", url: `${base}/photo-1560472355-536de3962603`, alt: "Financial reports and business planning documents" },
  ];

  for (const img of siteImages) {
    await prisma.siteImage.upsert({
      where: { key: img.key },
      update: { url: img.url, alt: img.alt },
      create: { key: img.key, url: img.url, alt: img.alt },
    });
  }
  console.log(`✅ Site Images: ${siteImages.length} entries`);

  console.log("\n🎉 Seed complete! Database is 100% synchronized with verified Account Dynamics data.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
