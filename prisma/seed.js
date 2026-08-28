const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // 1. Admin user
  const password = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@accountdynamics.com" },
    update: {},
    create: { name: "Administrator", email: "admin@accountdynamics.com", password, role: "admin" },
  });
  console.log("✓ Admin user: admin@accountdynamics.com / admin123");

  // 2. Settings
  const settings = [
    { key: "companyName", value: "Account Dynamics" },
    { key: "tagline", value: "Tax | Cloud Accounting | Advisory | Business Data Analysts" },
    { key: "email", value: "info@accountdynamics.com" },
    { key: "phone", value: "416-748-2042" },
    { key: "address", value: "55 Baywood Road, 2nd Floor, Toronto, Ontario M9V 3Y8" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log("✓ Settings created");

  // 3. Team members
  const tmCount = await prisma.teamMember.count();
  if (tmCount === 0) {
    const teamMembers = [
      { name: "Joseph P. Mathews", role: "Founder, CEO & CFO", bio: "Registered Professional Accountant and member of the Society of Professional Accountants of Canada.", avatar: "/team/joseph-mathews.jpg", socialLinks: JSON.stringify({}), order: 1 },
      { name: "Rishi", role: "Manager", bio: "Valuable member since 2014. Expertise in business analytics, CRA audits, and client on-boarding.", avatar: "/team/rishi.jpg", socialLinks: JSON.stringify({}), order: 2 },
      { name: "Amrit", role: "Office Manager", bio: "Certified ProAdvisor (QuickBooks) with over 20 years of experience in corporate and personal tax returns.", avatar: "/team/amrit.jpg", socialLinks: JSON.stringify({}), order: 3 },
      { name: "Yogesh", role: "Accounts Supervisor", bio: "Certified ProAdvisor (QuickBooks) with around 12 years of experience in bookkeeping and tax preparations.", avatar: "/team/yogesh.jpg", socialLinks: JSON.stringify({}), order: 4 },
      { name: "Hari", role: "Bookkeeping & Payroll Supervisor", bio: "Over 30 years of diverse work experience. Certified Intuit Pro-Advisor Accountant.", avatar: "/team/hari.jpg", socialLinks: JSON.stringify({}), order: 5 },
      { name: "Nikhil", role: "IT", bio: "Results-driven UI/UX designer with experience in creating intuitive interfaces.", avatar: "/team/nikhil.jpg", socialLinks: JSON.stringify({}), order: 6 },
    ];
    for (const tm of teamMembers) {
      await prisma.teamMember.create({ data: tm });
    }
    console.log("✓ Team members created");
  } else {
    console.log("→ Team members already exist, skipping");
  }

  console.log("\n✓ Seed completed successfully!");
  console.log("  Admin: admin@accountdynamics.com / admin123");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
