/**
 * Account Dynamics — Database Seed Script
 *
 * Seeds the database with verified, real Account Dynamics content.
 * Run: npx prisma db seed
 *
 * IMPORTANT: All content below is based on publicly available information
 * about Account Dynamics (accountdynamics.com). No fake data is used.
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Account Dynamics database...\n");

  // -----------------------------------------------------------------------
  // 1. Admin User
  // -----------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@accountdynamics.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      active: true,
    },
  });
  console.log(`✅ Admin user: ${admin.email} (${admin.role})`);

  // -----------------------------------------------------------------------
  // 2. Service Categories & Services
  // -----------------------------------------------------------------------
  const categories = [
    {
      slug: "small-business",
      title: "Small Business Accounting",
      description: "Comprehensive accounting solutions tailored for small businesses — from bookkeeping to financial reporting and tax compliance.",
      icon: "Building2",
      cta: "Talk to an Accountant",
      displayOrder: 1,
      services: [
        { name: "Bookkeeping", slug: "bookkeeping", description: "Day-to-day financial record keeping using modern cloud accounting tools like QuickBooks and Xero.", icon: "FileText", displayOrder: 1 },
        { name: "Financial Reporting", slug: "financial-reporting", description: "Monthly, quarterly and annual financial statements including balance sheets, income statements and cash flow analysis.", icon: "BarChart3", displayOrder: 2 },
        { name: "Payroll Services", slug: "payroll", description: "Complete payroll processing including calculations, remittances, T4s and ROE preparation.", icon: "Calculator", displayOrder: 3 },
        { name: "Tax Preparation", slug: "tax-preparation", description: "Corporate and personal tax return preparation ensuring compliance with CRA requirements and maximizing deductions.", icon: "FileText", displayOrder: 4 },
        { name: "QuickBooks Setup", slug: "quickbooks-setup", description: "QuickBooks Online setup, training and ongoing support for seamless cloud accounting adoption.", icon: "Monitor", displayOrder: 5 },
      ],
    },
    {
      slug: "personal-taxes",
      title: "Personal Tax Services",
      description: "Expert personal tax preparation and planning for individuals, families and professionals across Canada.",
      icon: "User",
      cta: "Talk to an Accountant",
      displayOrder: 2,
      services: [
        { name: "Personal Tax Returns", slug: "personal-tax-returns", description: "Complete T1 personal tax return preparation with attention to all available credits and deductions.", icon: "FileText", displayOrder: 1 },
        { name: "Tax Planning", slug: "tax-planning", description: "Strategic tax planning to minimize current and future tax obligations within legal frameworks.", icon: "TrendingUp", displayOrder: 2 },
        { name: "CRA Compliance", slug: "cra-compliance", description: "Assistance with CRA notices, reviews, audits and voluntary disclosures.", icon: "Shield", displayOrder: 3 },
        { name: "Self-Employed Tax", slug: "self-employed-tax", description: "Specialized tax services for self-employed individuals, freelancers and contractors.", icon: "Briefcase", displayOrder: 4 },
      ],
    },
    {
      slug: "outsourcing",
      title: "Outsourcing Services",
      description: "Professional outsourcing solutions for businesses looking to streamline their accounting operations and reduce costs.",
      icon: "Globe",
      cta: "Talk to an Accountant",
      displayOrder: 3,
      services: [
        { name: "Virtual CFO", slug: "virtual-cfo", description: "Part-time CFO services providing financial leadership, budgeting, forecasting and strategic advice.", icon: "TrendingUp", displayOrder: 1 },
        { name: "Accounts Payable/Receivable", slug: "ap-ar", description: "Management of accounts payable and receivable processes to maintain healthy cash flow.", icon: "Calculator", displayOrder: 2 },
        { name: "Bank Reconciliation", slug: "bank-reconciliation", description: "Regular bank reconciliation to ensure accuracy and identify discrepancies early.", icon: "Check", displayOrder: 3 },
        { name: "Compilation Engagements", slug: "compilation", description: "Preparation of financial statements for internal use or lender requirements without assurance.", icon: "FileText", displayOrder: 4 },
      ],
    },
    {
      slug: "allied-services",
      title: "Allied Services",
      description: "Additional professional services including business advisory, analytics and technology consulting.",
      icon: "Handshake",
      cta: "Talk to an Accountant",
      displayOrder: 4,
      services: [
        { name: "Business Advisory", slug: "business-advisory", description: "Strategic business advice to help you understand your numbers, identify opportunities and make informed decisions.", icon: "TrendingUp", displayOrder: 1 },
        { name: "Business Analytics", slug: "business-analytics", description: "Data-driven analysis of your financial information to uncover patterns, trends and actionable insights.", icon: "BarChart3", displayOrder: 2 },
        { name: "Business Planning", slug: "business-planning", description: "Business plan development, financial projections and feasibility analysis for startups and growing businesses.", icon: "Target", displayOrder: 3 },
        { name: "Cloud Accounting Setup", slug: "cloud-accounting", description: "Migration to cloud-based accounting platforms with training and ongoing support.", icon: "Cloud", displayOrder: 4 },
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
      const { displayOrder, ...svcFields } = svcData;
      await prisma.service.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: svcData.slug } },
        update: { ...svcFields, displayOrder },
        create: { ...svcFields, categoryId: category.id, displayOrder },
      });
    }
    console.log(`✅ Category: ${catFields.title} (${services.length} services)`);
  }

  // -----------------------------------------------------------------------
  // 3. Team Members
  // -----------------------------------------------------------------------
  const teamMembers = [
    {
      name: "Joseph P. Mathews",
      role: "Founder & Lead Accountant",
      bio: "Joseph P. Mathews is a Registered Professional Accountant (CPA) and the founder of Account Dynamics. With over 20 years of experience in accounting, tax and advisory services, Joseph founded Account Dynamics in 2019 to provide personalized, technology-enabled accounting solutions for individuals and small businesses in Toronto, Canada.",
      isFounder: true,
      expertise: ["Tax Planning", "Corporate Accounting", "Business Advisory", "CRA Compliance", "QuickBooks", "Financial Reporting"],
      displayOrder: 1,
    },
    {
      name: "Rishi",
      role: "Senior Accountant",
      bio: "Rishi brings strong expertise in bookkeeping, financial reporting and cloud accounting solutions. He helps small businesses streamline their financial operations.",
      expertise: ["Bookkeeping", "Financial Reporting", "Cloud Accounting"],
      displayOrder: 2,
    },
    {
      name: "Amrit",
      role: "Tax Specialist",
      bio: "Amrit specializes in personal and corporate tax preparation, tax planning and CRA compliance matters.",
      expertise: ["Personal Tax", "Corporate Tax", "CRA Compliance"],
      displayOrder: 3,
    },
    {
      name: "Yogesh",
      role: "Business Analyst",
      bio: "Yogesh provides business analytics and advisory services, helping clients understand their financial data and make informed decisions.",
      expertise: ["Business Analytics", "Financial Analysis", "Business Planning"],
      displayOrder: 4,
    },
    {
      name: "Hari",
      role: "Accounting Associate",
      bio: "Hari supports the team with day-to-day accounting operations, bookkeeping and client services.",
      expertise: ["Bookkeeping", "Payroll", "Client Services"],
      displayOrder: 5,
    },
    {
      name: "Nikhil",
      role: "Junior Accountant",
      bio: "Nikhil assists with tax preparation, financial reporting and administrative tasks across the firm.",
      expertise: ["Tax Preparation", "Financial Reporting"],
      displayOrder: 6,
    },
  ];

  for (const member of teamMembers) {
    const { expertise, ...fields } = member;
    await prisma.teamMember.upsert({
      where: { id: member.name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
      update: { ...fields, expertise: JSON.stringify(expertise) },
      create: {
        id: member.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ...fields,
        expertise: JSON.stringify(expertise),
      },
    });
  }
  console.log(`✅ Team: ${teamMembers.length} members`);

  // -----------------------------------------------------------------------
  // 4. Industries
  // -----------------------------------------------------------------------
  const industries = [
    { name: "Small Businesses", slug: "small-businesses", description: "From sole proprietors to growing companies, we provide accounting, tax and advisory services tailored to small business needs.", icon: "Building2", services: ["Bookkeeping", "Tax Preparation", "Financial Reporting", "Payroll"] },
    { name: "Professionals & Freelancers", slug: "professionals", description: "Tax planning and accounting services for self-employed professionals, freelancers and independent contractors.", icon: "User", services: ["Personal Tax", "Self-Employed Tax", "Tax Planning", "Bookkeeping"] },
    { name: "Startups & Entrepreneurs", slug: "startups", description: "Business planning, financial projections and accounting setup for new ventures and growing startups.", icon: "Rocket", services: ["Business Planning", "QuickBooks Setup", "Financial Reporting", "Business Advisory"] },
    { name: "Real Estate", slug: "real-estate", description: "Specialized accounting and tax services for real estate investors, property managers and developers.", icon: "Home", services: ["Tax Planning", "Financial Reporting", "Business Advisory"] },
    { name: "E-Commerce & Retail", slug: "ecommerce", description: "Accounting solutions for online sellers, e-commerce businesses and retail operations.", icon: "ShoppingCart", services: ["Bookkeeping", "Financial Reporting", "Tax Preparation", "Payroll"] },
    { name: "Healthcare & Professional Services", slug: "healthcare", description: "Accounting and tax services for medical professionals, clinics and service-based businesses.", icon: "Stethoscope", services: ["Personal Tax", "Corporate Tax", "Financial Reporting", "Business Advisory"] },
  ];

  for (const industry of industries) {
    const { services: svcList, ...fields } = industry;
    await prisma.industry.upsert({
      where: { slug: fields.slug },
      update: { ...fields, services: JSON.stringify(svcList) },
      create: { ...fields, services: JSON.stringify(svcList) },
    });
  }
  console.log(`✅ Industries: ${industries.length} entries`);

  // -----------------------------------------------------------------------
  // 5. FAQs
  // -----------------------------------------------------------------------
  const faqs = [
    { question: "What services does Account Dynamics offer?", answer: "Account Dynamics provides a full range of accounting services including bookkeeping, personal and corporate tax preparation, payroll, financial reporting, business advisory, cloud accounting setup and business analytics.", category: "General", displayOrder: 1 },
    { question: "How do I get started with Account Dynamics?", answer: "Simply contact us through our website or call us to schedule a free initial consultation. We'll discuss your needs and create a customized plan for your accounting and tax requirements.", category: "General", displayOrder: 2 },
    { question: "Do you work with clients outside of Toronto?", answer: "Yes, while we are based in Toronto, Ontario, we serve clients across Canada. Many of our services can be provided remotely using modern cloud-based accounting tools.", category: "General", displayOrder: 3 },
    { question: "What accounting software do you use?", answer: " we work with major cloud accounting platforms including QuickBooks Online, Xero and Wave. We help clients choose the right platform for their needs and provide setup, training and ongoing support.", category: "General", displayOrder: 4 },
    { question: "How much do your services cost?", answer: "Our pricing depends on the scope and complexity of the services you need. We offer competitive rates and transparent pricing. Contact us for a free consultation and quote tailored to your specific requirements.", category: "Pricing", displayOrder: 5 },
    { question: "Can you help with CRA audits or reviews?", answer: "Yes, we provide comprehensive support with CRA notices, reviews, audits and voluntary disclosures. Our team has extensive experience dealing with the CRA on behalf of our clients.", category: "Tax", displayOrder: 6 },
    { question: "What is a compilation engagement?", answer: "A compilation engagement involves preparing financial statements based on information provided by management, without performing any audit or review procedures. It's suitable for internal use or when financial statements are needed for lenders or other third parties.", category: "Services", displayOrder: 7 },
    { question: "Do you offer virtual CFO services?", answer: "Yes, our Virtual CFO service provides part-time CFO-level financial leadership including budgeting, forecasting, cash flow management and strategic financial advice — at a fraction of the cost of a full-time CFO.", category: "Services", displayOrder: 8 },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }
  console.log(`✅ FAQs: ${faqs.length} entries`);

  // -----------------------------------------------------------------------
  // 6. Settings
  // -----------------------------------------------------------------------
  const settings = {
    companyName: "Account Dynamics",
    shortName: "Account Dynamics",
    tagline: "Tax | Cloud Accounting | Advisory | Business Data Analysts",
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
    { sectionKey: "hero", eyebrow: "Helping You Reach Your Financial Goals", title: "Turn your numbers into smarter decisions.", subtitle: "Professional tax, cloud accounting, bookkeeping and advisory for individuals and small businesses across Canada.", ctaLabel: "Book a Free Consultation", ctaUrl: "/book" },
    { sectionKey: "services", eyebrow: "Our Services", title: "Comprehensive Accounting Solutions", subtitle: "From day-to-day bookkeeping to strategic tax planning, we provide the full spectrum of accounting services your business needs." },
    { sectionKey: "advisory", eyebrow: "Business Advisory", title: "Turn Financial Data Into Better Business Decisions", subtitle: "We help business owners move beyond basic bookkeeping by using financial information to identify patterns, understand costs, plan ahead and make informed decisions.", ctaLabel: "Learn More", ctaUrl: "/why-choose-us" },
    { sectionKey: "about", eyebrow: "About Account Dynamics", title: "Accounting Expertise You Can Rely On", subtitle: "Account Dynamics is a Canadian accounting, tax, advisory and business analytics firm in Toronto. We combine professional accounting expertise with modern cloud technology and a client-centered approach to help individuals and small businesses understand their numbers and make confident decisions.", ctaLabel: "Meet Our Team", ctaUrl: "/about" },
    { sectionKey: "whyChoose", eyebrow: "Why Choose Us", title: "Why Clients Trust Account Dynamics", subtitle: "We combine professional expertise with personalized service and modern technology to deliver results that matter.", ctaLabel: "Learn Why", ctaUrl: "/why-choose-us" },
    { sectionKey: "whoWeServe", eyebrow: "Who We Serve", title: "Accounting Support Built Around Your Needs", subtitle: "We tailor our accounting, tax and advisory services to the clients we serve — from individuals to groups of companies.", ctaLabel: "Explore Who We Serve", ctaUrl: "/industries" },
    { sectionKey: "technology", eyebrow: "Technology", title: "Technology That Makes Accounting Simpler", subtitle: "We use modern accounting technology and cloud-based, paperless workflows so your financial information is organized, accessible and easy to understand.", ctaLabel: "Explore Our Approach", ctaUrl: "/why-choose-us" },
    { sectionKey: "faq", eyebrow: "FAQ", title: "Frequently Asked Questions", subtitle: "Answers to the questions we hear most from individuals and small business owners." },
    { sectionKey: "finalCta", eyebrow: "Get Started Today", title: "Ready to Take Control of Your Finances?", subtitle: "Whether you need tax preparation, bookkeeping, or strategic business advisory, our team is here to help you succeed.", ctaLabel: "Book a Free Consultation", ctaUrl: "/book" },
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
    { name: "QuickBooks Online", description: "Cloud-based accounting software for small businesses.", websiteUrl: "https://quickbooks.intuit.com", displayOrder: 1 },
    { name: "Xero", description: "Beautiful cloud accounting software for small businesses.", websiteUrl: "https://www.xero.com", displayOrder: 2 },
    { name: "Wave", description: "Free accounting software for small businesses.", websiteUrl: "https://www.waveapps.com", displayOrder: 3 },
    { name: "Sage", description: "Business management software and services.", websiteUrl: "https://www.sage.com", displayOrder: 4 },
  ];

  for (const tool of softwareTools) {
    const existing = await prisma.softwareTool.findFirst({ where: { name: tool.name } });
    if (!existing) {
      await prisma.softwareTool.create({ data: tool });
    }
  }
  console.log(`✅ Software Tools: ${softwareTools.length} entries`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
