/**
 * Global Line Safaris — Database Seed Script
 *
 * Seeds the database with verified Global Line Safaris content sourced from
 * globallinesafaris.rw. Content lives in prisma/data/*.json so it can be
 * reviewed and updated without touching this script.
 *
 * Run: npm run db:seed
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const DEFAULT_ADMIN_PASSWORD = "change-me";

function isDefaultPassword(password) {
  return password === DEFAULT_ADMIN_PASSWORD;
}

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 12 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}

function loadData(file) {
  const full = path.join(__dirname, "data", file);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "image/jpeg";
}

async function main() {
  console.log("🌱 Seeding Global Line Safaris database...\n");

  const site = loadData("site.json");
  const destinations = loadData("destinations.json");
  const packages = loadData("packages.json");
  const blogPosts = loadData("blog.json");

  // -----------------------------------------------------------------------
  // 1. Admin User (logic preserved from the original template seed)
  // -----------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && (isDefaultPassword(adminPassword) || !isStrongPassword(adminPassword))) {
    console.error(
      "\n❌ Refusing to seed the SUPER_ADMIN user in production.\n" +
        "   ADMIN_PASSWORD must be set to a strong password (min 12 chars, " +
        "letters and numbers) and may NOT be the default 'change-me'.\n"
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (isProduction) {
    if (admin) {
      console.log(`✅ Super Admin user: ${admin.email} (${admin.role}) — password preserved`);
    } else {
      admin = await prisma.user.create({
        data: { email: adminEmail, name: "Admin", password: hashedPassword, role: "SUPER_ADMIN", active: true },
      });
      console.log(`✅ Created Super Admin user: ${admin.email}`);
    }
  } else {
    admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: hashedPassword, role: "SUPER_ADMIN", active: true },
      create: { email: adminEmail, name: "Admin", password: hashedPassword, role: "SUPER_ADMIN", active: true },
    });
    console.log(`✅ Super Admin user: ${admin.email} (${admin.role})`);
  }

  // -----------------------------------------------------------------------
  // 2. Service Categories, Services & Benefits
  // -----------------------------------------------------------------------
  const activeCategorySlugs = site.serviceCategories.map((c) => c.slug);
  const activeServiceSlugs = site.serviceCategories.flatMap((c) => c.services.map((s) => s.slug));

  await prisma.service.deleteMany({ where: { status: { in: ["ARCHIVED", "DRAFT"] } } });
  for (const catSlug of activeCategorySlugs) {
    const stale = await prisma.service.findMany({
      where: { status: "PUBLISHED", slug: { notIn: activeServiceSlugs }, category: { slug: catSlug } },
    });
    if (stale.length) {
      await prisma.service.deleteMany({ where: { id: { in: stale.map((s) => s.id) } } });
    }
  }
  await prisma.serviceCategory.deleteMany({
    where: { status: "PUBLISHED", slug: { notIn: activeCategorySlugs } },
  });

  for (const catData of site.serviceCategories) {
    const { services, ...catFields } = catData;
    const category = await prisma.serviceCategory.upsert({
      where: { slug: catFields.slug },
      update: { ...catFields, status: "PUBLISHED" },
      create: { ...catFields, status: "PUBLISHED" },
    });

    for (const svcData of services) {
      const { benefits, ...svcFields } = svcData;
      const service = await prisma.service.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: svcData.slug } },
        update: { ...svcFields, status: "PUBLISHED" },
        create: { ...svcFields, categoryId: category.id, status: "PUBLISHED" },
      });

      await prisma.serviceBenefit.deleteMany({ where: { serviceId: service.id } });
      if (benefits && benefits.length) {
        for (let i = 0; i < benefits.length; i++) {
          await prisma.serviceBenefit.create({
            data: { serviceId: service.id, text: benefits[i], displayOrder: i + 1 },
          });
        }
      }
    }
    console.log(`✅ Category: ${catFields.title} (${services.length} services)`);
  }

  // -----------------------------------------------------------------------
  // 3. Team Members
  // -----------------------------------------------------------------------
  for (const member of site.team) {
    const { expertise, ...fields } = member;
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: { ...fields, expertise: JSON.stringify(expertise), status: "PUBLISHED" },
      create: { ...fields, expertise: JSON.stringify(expertise), status: "PUBLISHED" },
    });
  }
  console.log(`✅ Team: ${site.team.length} members`);

  // -----------------------------------------------------------------------
  // 4. Audiences (Who We Serve)
  // -----------------------------------------------------------------------
  for (const industry of site.industries) {
    const { services: svcList, ...fields } = industry;
    await prisma.industry.upsert({
      where: { slug: fields.slug },
      update: { ...fields, services: JSON.stringify(svcList), status: "PUBLISHED" },
      create: { ...fields, services: JSON.stringify(svcList), status: "PUBLISHED" },
    });
  }
  console.log(`✅ Audiences: ${site.industries.length}`);

  // -----------------------------------------------------------------------
  // 5. Destinations
  // -----------------------------------------------------------------------
  for (let i = 0; i < destinations.length; i++) {
    const d = destinations[i];
    const data = {
      name: d.name,
      slug: d.slug,
      location: d.location ?? null,
      category: d.category ?? null,
      shortDescription: d.shortDescription ?? null,
      description: d.description ?? "",
      image: d.image ?? null,
      galleryImages: d.galleryImages ? JSON.stringify(d.galleryImages) : null,
      featured: Boolean(d.featured),
      displayOrder: i + 1,
      status: "PUBLISHED",
    };
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Destinations: ${destinations.length}`);

  // -----------------------------------------------------------------------
  // 6. Tour Packages
  // -----------------------------------------------------------------------
  for (let i = 0; i < packages.length; i++) {
    const p = packages[i];
    const data = {
      title: p.title,
      slug: p.slug,
      location: p.location ?? null,
      category: p.category ?? null,
      duration: p.duration ?? null,
      price: p.price ?? null,
      priceNote: p.priceNote ?? null,
      overview: p.overview ?? "",
      facts: p.facts ?? null,
      highlights: p.highlights ? JSON.stringify(p.highlights) : null,
      itinerary: p.days ? JSON.stringify(p.days) : null,
      inclusions: p.inclusions ? JSON.stringify(p.inclusions) : null,
      exclusions: p.exclusions ? JSON.stringify(p.exclusions) : null,
      note: p.note ?? null,
      image: p.image ?? null,
      featured: Boolean(p.featured),
      displayOrder: i + 1,
      status: "PUBLISHED",
    };
    await prisma.tourPackage.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Tour Packages: ${packages.length}`);

  // -----------------------------------------------------------------------
  // 7. FAQs
  // -----------------------------------------------------------------------
  await prisma.faqItem.deleteMany();
  for (const faq of site.faqs) {
    await prisma.faqItem.create({ data: { ...faq, status: "PUBLISHED" } });
  }
  console.log(`✅ FAQs: ${site.faqs.length}`);

  // -----------------------------------------------------------------------
  // 8. Settings
  // -----------------------------------------------------------------------
  for (const [key, value] of Object.entries(site.settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value ?? "") },
      create: { key, value: String(value ?? "") },
    });
  }
  console.log(`✅ Settings: ${Object.keys(site.settings).length}`);

  // -----------------------------------------------------------------------
  // 9. Homepage Sections
  // -----------------------------------------------------------------------
  for (const section of site.homepageSections) {
    const { items, ...fields } = section;
    const data = { ...fields, items: items ? JSON.stringify(items) : null };
    await prisma.homepageSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Homepage: ${site.homepageSections.length} sections`);

  // -----------------------------------------------------------------------
  // 10. SEO Settings
  // -----------------------------------------------------------------------
  for (const seo of site.seo) {
    await prisma.seoSetting.upsert({
      where: { pageKey: seo.pageKey },
      update: { ...seo, indexable: true },
      create: { ...seo, indexable: true },
    });
  }
  console.log(`✅ SEO: ${site.seo.length} pages`);

  // -----------------------------------------------------------------------
  // 11. Site Images
  // -----------------------------------------------------------------------
  for (const img of site.siteImages) {
    await prisma.siteImage.upsert({
      where: { key: img.key },
      update: { url: img.url, alt: img.alt },
      create: { key: img.key, url: img.url, alt: img.alt },
    });
  }
  console.log(`✅ Site Images: ${site.siteImages.length}`);

  // -----------------------------------------------------------------------
  // 12. Gallery media (seeded from /public/gls/gallery)
  // -----------------------------------------------------------------------
  const galleryDir = path.join(__dirname, "..", "public", "gls", "gallery");
  if (fs.existsSync(galleryDir)) {
    const files = fs
      .readdirSync(galleryDir)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort();

    await prisma.media.deleteMany({ where: { uploadedById: null, url: { startsWith: "/gls/gallery/" } } });

    let count = 0;
    for (const file of files) {
      const full = path.join(galleryDir, file);
      const stat = fs.statSync(full);
      await prisma.media.create({
        data: {
          name: file,
          url: `/gls/gallery/${file}`,
          alt: "Global Line Safaris gallery image",
          title: file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
          mimeType: mimeFor(file),
          size: stat.size,
        },
      });
      count++;
    }
    console.log(`✅ Gallery media: ${count} images`);
  } else {
    console.log("⚠️  Gallery directory not found — skipped gallery media");
  }

  // -----------------------------------------------------------------------
  // 13. Blog posts
  // -----------------------------------------------------------------------
  for (let i = 0; i < blogPosts.length; i++) {
    const b = blogPosts[i];
    const data = {
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt ?? "",
      content: b.content ?? "",
      category: b.category ?? "Travel Guides",
      image: b.image ?? null,
      author: b.author ?? "Global Line Safaris",
      readTime: b.readTime ?? null,
      seoTitle: b.seoTitle ?? null,
      seoDescription: b.seoDescription ?? null,
      featured: Boolean(b.featured),
      displayOrder: i + 1,
      status: "PUBLISHED",
    };
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: data,
      create: data,
    });
  }
  console.log(`✅ Blog Posts: ${blogPosts.length}`);

  console.log("\n🎉 Seed complete! Global Line Safaris content is ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
