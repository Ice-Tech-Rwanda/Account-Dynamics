const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ── Data from src/data/site.ts ──────────────────────────────────────────

const contactInfo = {
  email: "info@kisc.rw",
  phone: "+250 700 000 000",
  address: "Kimironko, Kigali, Rwanda",
  whatsapp: "https://wa.me/250700000000",
  socialLinks: {
    facebook: "https://facebook.com/kisc",
    twitter: "https://twitter.com/kisc_rw",
    instagram: "https://instagram.com/kisc_rw",
    youtube: "https://youtube.com/@kisc",
    tiktok: "https://tiktok.com/@kisc_rw",
  },
};

const statCounters = [
  { label: "Active Players", value: 150, suffix: "+", icon: "Users" },
  { label: "Tournaments Held", value: 45, suffix: "+", icon: "Trophy" },
  { label: "Resources Available", value: 80, suffix: "+", icon: "BookOpen" },
  { label: "Partner Schools", value: 12, suffix: "", icon: "Building2" },
];

const teamMembers = [
  { id: "1", name: "Jean-Pierre Habimana", role: "Club President & Founder", bio: "Passionate Scrabble advocate with 15 years of competitive experience. Founded KiSC to promote Scrabble in Rwanda.", avatar: "/team/president.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "jp@kisc.rw" }, order: 1 },
  { id: "2", name: "Alice Mukamana", role: "Vice President & Tournament Director", bio: "Organizes all club tournaments and events. National Scrabble champion 2023.", avatar: "/team/vp.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "alice@kisc.rw" }, order: 2 },
  { id: "3", name: "David Niyonzima", role: "Secretary & Communications Lead", bio: "Handles club communications, social media, and community outreach programs.", avatar: "/team/secretary.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "david@kisc.rw" }, order: 3 },
  { id: "4", name: "Grace Uwimana", role: "Treasurer & Sponsorship Coordinator", bio: "Manages club finances and builds partnerships with sponsors and donors.", avatar: "/team/treasurer.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "grace@kisc.rw" }, order: 4 },
  { id: "5", name: "Patrick Mugisha", role: "Head Coach & Youth Development", bio: "Leads training sessions and youth development programs across schools.", avatar: "/team/coach.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "patrick@kisc.rw" }, order: 5 },
  { id: "6", name: "Diane Ishimwe", role: "Women's Program Coordinator", bio: "Drives women empowerment initiatives and female player recruitment.", avatar: "/team/women.jpg", socialLinks: { twitter: "#", linkedin: "#", email: "diane@kisc.rw" }, order: 6 },
];

const eventCategories = [
  { id: "weekly", name: "Weekly Meetups", slug: "weekly", description: "Casual gatherings every week for practice and friendly games.", color: "blue", icon: "Calendar", count: 48 },
  { id: "social", name: "Tournaments", slug: "social", description: "Competitive tournaments with prizes and rankings.", color: "purple", icon: "Trophy", count: 24 },
  { id: "university", name: "University Events", slug: "university", description: "Inter-university leagues and campus competitions.", color: "orange", icon: "GraduationCap", count: 16 },
  { id: "school", name: "School Programs", slug: "school", description: "Outreach programs and competitions for secondary schools.", color: "pink", icon: "School", count: 32 },
  { id: "workshop", name: "Workshops", slug: "workshop", description: "Skill-building sessions on strategy and technique.", color: "emerald", icon: "BookOpen", count: 20 },
];

const coreValues = [
  { id: "1", title: "Excellence", description: "We strive for the highest standards in Scrabble gameplay, sportsmanship, and community engagement.", icon: "Trophy" },
  { id: "2", title: "Inclusivity", description: "Scrabble is for everyone. We welcome players of all ages, backgrounds, and skill levels.", icon: "Users" },
  { id: "3", title: "Education", description: "We believe Scrabble is a powerful tool for learning, building vocabulary, critical thinking, and confidence.", icon: "BookOpen" },
  { id: "4", title: "Community", description: "We build lasting connections through shared passion, mutual respect, and collaborative growth.", icon: "Heart" },
  { id: "5", title: "Integrity", description: "We uphold fair play, transparency, and ethical conduct in every tournament and program.", icon: "Shield" },
  { id: "6", title: "Innovation", description: "We embrace new ideas, digital tools, and creative approaches to grow Scrabble in Rwanda.", icon: "Lightbulb" },
];

const benefits = [
  { id: "1", title: "Cognitive Development", description: "Scrabble enhances vocabulary, spelling, math skills, and strategic thinking. Studies show regular play improves memory and delays cognitive decline.", icon: "Brain", stats: [{ label: "Vocabulary Boost", value: "40%" }, { label: "Memory Improvement", value: "35%" }] },
  { id: "2", title: "Educational Impact", description: "Through our school programs, students improve their English proficiency and academic performance while having fun.", icon: "GraduationCap", stats: [{ label: "Partner Schools", value: "12" }, { label: "Students Reached", value: "500+" }] },
  { id: "3", title: "Community Building", description: "We create inclusive spaces where people connect across generations, backgrounds, and skill levels through friendly competition.", icon: "Handshake", stats: [{ label: "Active Members", value: "150+" }, { label: "Annual Events", value: "20+" }] },
  { id: "4", title: "Personal Growth", description: "Build confidence, sportsmanship, and leadership skills through competition and club involvement.", icon: "TrendingUp", stats: [{ label: "Leadership Roles", value: "10+" }, { label: "Workshops Held", value: "30+" }] },
];

const historyMilestones = [
  { year: "2018", title: "The Founding", description: "KiSC was founded by Jean-Pierre Habimana with just 8 members meeting at a local community center in Kimironko, Kigali." },
  { year: "2019", title: "First Tournament", description: "Organized the first inter-school Scrabble tournament, attracting 50 participants from 5 schools across Kigali." },
  { year: "2020", title: "Digital Pivot", description: "Launched online Scrabble sessions during the pandemic, growing our reach to 100+ active members nationwide." },
  { year: "2021", title: "Partnership Era", description: "Secured partnerships with the Rwanda Scrabble Federation and University of Rwanda, establishing university leagues." },
  { year: "2022", title: "National Recognition", description: "KiSC members swept the National Scrabble Championships, with 3 of our players in the top 5 rankings." },
  { year: "2023", title: "School Outreach", description: "Expanded to 12 partner schools with weekly Scrabble programs, reaching over 500 young players." },
  { year: "2024", title: "Regional Stage", description: "Represented Rwanda at the East African Scrabble Championships and launched the women's program." },
  { year: "2025", title: "Community Hub", description: "Opened the first dedicated Scrabble clubhouse in Kimironko and launched the KiSC merchandise line." },
  { year: "2026", title: "Growing Legacy", description: "Over 150 active members, 45+ tournaments held, and growing Rwanda's Scrabble excellence every day." },
];

const journeyMilestones = [
  { year: "2018", title: "Humble Beginnings", description: "8 passionate Scrabble players gathered at a small community center.", icon: "Users" },
  { year: "2019", title: "First Victory", description: "Won our first inter-school Scrabble tournament.", icon: "Trophy" },
  { year: "2020", title: "Going Digital", description: "Adapted to online play and grew our community during the pandemic.", icon: "Monitor" },
  { year: "2021", title: "Partnerships", description: "Formed strategic partnerships with schools and sponsors.", icon: "Handshake" },
  { year: "2022", title: "National Stage", description: "Members represented Rwanda at international tournaments.", icon: "Globe" },
  { year: "2023", title: "Youth Focus", description: "Launched dedicated youth and schools programs.", icon: "School" },
  { year: "2024", title: "Women's Initiative", description: "Started women's program promoting gender inclusion.", icon: "Heart" },
  { year: "2025", title: "Clubhouse", description: "Opened our first dedicated Scrabble clubhouse.", icon: "Home" },
  { year: "2026", title: "150+ Members", description: "A thriving community of over 150 active Scrabble enthusiasts.", icon: "Users" },
];

const successStories = [
  { id: "1", name: "Marie Uwimana", age: 17, school: "Lycee de Kigali", story: "Marie started playing Scrabble at a KiSC school workshop. Within a year, she won the national school championship and represented Rwanda at the East African Scrabble Championships.", achievement: "National School Champion 2025", image: "/stories/marie.jpg", order: 1 },
  { id: "2", name: "Eric Habimana", age: 22, university: "University of Rwanda", story: "Eric joined the University Scrabble League as a freshman. He is now the university team captain and has organized Scrabble programs at 5 different campuses.", achievement: "University League Champion 2025", image: "/stories/eric.jpg", order: 2 },
  { id: "3", name: "Jeanne d'Arc Uwase", age: 28, role: "Women's Program Lead", story: "Jeanne joined KiSC to learn Scrabble and discovered a passion for the game. She now leads the women's program, mentoring over 30 female players.", achievement: "Women's Program Coordinator", image: "/stories/jeanne.jpg", order: 3 },
];

const sponsorshipPackages = [
  { name: "Platinum", price: 10000000, description: "Premier sponsorship package with maximum visibility and branding opportunities.", benefits: ["Title sponsorship of one major tournament", "Logo on all event materials", "Social media campaign", "10 VIP event passes", "Annual report feature", "Speaking opportunities"], popular: true, order: 1 },
  { name: "Gold", price: 5000000, description: "Premium package with strong brand presence across club activities.", benefits: ["Co-sponsorship of tournaments", "Logo on website and social media", "5 VIP event passes", "Quarterly spotlight posts", "Branding at club events"], popular: false, order: 2 },
  { name: "Silver", price: 2000000, description: "Standard sponsorship package for community-minded organizations.", benefits: ["Logo on website partners page", "Social media mentions", "3 event passes", "Monthly recognition"], popular: false, order: 3 },
  { name: "Bronze", price: 500000, description: "Entry-level sponsorship for small businesses and individuals.", benefits: ["Name on website supporters page", "Social media thank you", "Newsletter mention"], popular: false, order: 4 },
];

const galleryItems = [
  { id: "m1", src: "/gallery/open-2025.jpg", title: "Rwanda Open 2025 Champions", description: "The top 3 players celebrate after an intense final day of competition at the Rwanda Open Scrabble Championship.", category: "tournaments", type: "image", date: new Date("2025-08-15") },
  { id: "m2", src: "/events/open.jpg", title: "Grand Final Match", description: "The deciding match of the Rwanda Open between Alice Mukamana and Jean-Pierre Habimana draws a captivated crowd.", category: "tournaments", type: "image", date: new Date("2025-08-15") },
  { id: "m3", src: "/events/weekly.jpg", title: "Weekly Meetup in Session", description: "Players of all skill levels gather every week at the Kimironko Community Center for friendly competition.", category: "meetups", type: "image", date: new Date("2026-06-10") },
  { id: "m4", src: "/gallery/training.jpg", title: "Strategy Training Session", description: "Head Coach Patrick Mugisha leading an intensive strategy workshop focused on bingo plays and rack management.", category: "meetups", type: "image", date: new Date("2026-05-20") },
  { id: "m5", src: "/events/workshop.jpg", title: "Advanced Strategy Workshop", description: "Participants working through advanced board positioning exercises during the monthly strategy workshop.", category: "meetups", type: "image", date: new Date("2026-04-10") },
  { id: "m6", src: "/gallery/school-outreach.jpg", title: "School Outreach Visit", description: "KiSC coaches introducing Scrabble to students at a partner school in Kicukiro District.", category: "school-programs", type: "image", date: new Date("2025-06-20") },
  { id: "m7", src: "/hero/slide-2.jpg", title: "Students Learning Scrabble", description: "Young students enthusiastically learning Scrabble rules during a school outreach program session.", category: "school-programs", type: "image", date: new Date("2025-09-12") },
  { id: "m8", src: "/gallery/university-finals.jpg", title: "University League Finals", description: "The championship match of the University Scrabble League draws a packed audience at UR-CAVM campus.", category: "university-events", type: "image", date: new Date("2025-05-10") },
  { id: "m9", src: "/events/university.jpg", title: "Inter-University Tournament", description: "Students from 6 universities competing in the quarterly inter-university Scrabble tournament.", category: "university-events", type: "image", date: new Date("2026-03-15") },
  { id: "m10", src: "/hero/slide-1.jpg", title: "Tournament Opening Ceremony", description: "The opening ceremony of a major tournament with participants from across Rwanda.", category: "tournaments", type: "image", date: new Date("2025-07-20") },
  { id: "m11", src: "/hero/slide-3.jpg", title: "Community Scrabble Day", description: "Families and community members gather for a special community Scrabble day event.", category: "meetups", type: "image", date: new Date("2025-11-08") },
  { id: "m12", src: "/hero/slide-4.jpg", title: "Youth Scrabble Exhibition", description: "Young players showcasing their skills at a youth Scrabble exhibition match.", category: "school-programs", type: "image", date: new Date("2026-01-25") },
  { id: "m13", src: "/gallery/extra-1.jpg", title: "Award Ceremony", description: "Winners celebrating their achievements at the monthly tournament award ceremony.", category: "tournaments", type: "image", date: new Date("2026-02-14") },
  { id: "m14", src: "/team/women.jpg", title: "Women in Scrabble Meetup", description: "Female players gathering for a special women's Scrabble networking event.", category: "meetups", type: "image", date: new Date("2026-03-08") },
  { id: "m15", src: "/team/coach.jpg", title: "Coach Training Program", description: "KiSC coaches participating in a professional development training session.", category: "meetups", type: "image", date: new Date("2025-10-05") },
  { id: "v1", src: "/gallery/training.jpg", title: "How to Play Scrabble: Beginner's Guide", description: "A complete walkthrough of Scrabble rules, scoring, and basic strategies for new players.", category: "meetups", type: "video", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", date: new Date("2026-01-15") },
  { id: "v2", src: "/gallery/open-2025.jpg", title: "Rwanda Open 2025 Highlights", description: "Relive the best moments from the Rwanda Open Scrabble Championship 2025.", category: "tournaments", type: "video", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", date: new Date("2025-08-20") },
  { id: "v3", src: "/gallery/university-finals.jpg", title: "University League Season Recap", description: "Highlights from the entire University Scrabble League season including finals.", category: "university-events", type: "video", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", date: new Date("2025-06-01") },
  { id: "v4", src: "/gallery/school-outreach.jpg", title: "School Program Impact Report", description: "See how KiSC's school outreach program is transforming education through Scrabble.", category: "school-programs", type: "video", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", date: new Date("2025-12-10") },
];

const playerProfiles = [
  {
    memberName: "Alice Mukamana", bestWord: "QUIZZIFY", bestScore: 178, totalTournaments: 24,
    titles: ["Rwanda Open 2025", "KiSC Grand Slam 2024", "National Championship 2023", "East African Semifinalist 2024"],
    ratingHistory: [
      { month: "Jan", rating: 1650 }, { month: "Feb", rating: 1680 }, { month: "Mar", rating: 1700 },
      { month: "Apr", rating: 1720 }, { month: "May", rating: 1750 }, { month: "Jun", rating: 1780 },
      { month: "Jul", rating: 1800 }, { month: "Aug", rating: 1820 }, { month: "Sep", rating: 1830 },
      { month: "Oct", rating: 1840 }, { month: "Nov", rating: 1850 }, { month: "Dec", rating: 1850 },
    ],
    tournamentHistory: [
      { id: "t1", tournamentName: "Rwanda Open 2025", date: "2025-08-15", position: 1, totalPlayers: 64, points: 12, prize: "RWF 500,000" },
      { id: "t2", tournamentName: "KiSC Grand Slam 2024", date: "2024-12-10", position: 1, totalPlayers: 48, points: 10, prize: "RWF 300,000" },
      { id: "t3", tournamentName: "National Championship", date: "2024-06-20", position: 1, totalPlayers: 80, points: 15, prize: "RWF 1,000,000" },
      { id: "t4", tournamentName: "East African Scrabble Championships", date: "2024-03-15", position: 4, totalPlayers: 32, points: 6 },
      { id: "t5", tournamentName: "KiSC Monthly May", date: "2025-05-10", position: 1, totalPlayers: 36, points: 9, prize: "RWF 50,000" },
    ],
    achievements: [
      { id: "a1", title: "Perfect Score", date: "2025-03-12", icon: "Award" },
      { id: "a2", title: "5-Tournament Win Streak", date: "2025-08-15", icon: "TrendingUp" },
      { id: "a3", title: "Highest Bingo Rate", date: "2025-06-01", icon: "Zap" },
      { id: "a4", title: "100 Career Wins", date: "2025-07-20", icon: "Trophy" },
    ],
  },
  {
    memberName: "Patrick Mugisha", bestWord: "JUXTAPOSE", bestScore: 192, totalTournaments: 18,
    titles: ["KiSC Grand Slam 2023", "Coach of the Year 2024"],
    ratingHistory: [
      { month: "Jan", rating: 1680 }, { month: "Feb", rating: 1700 }, { month: "Mar", rating: 1710 },
      { month: "Apr", rating: 1730 }, { month: "May", rating: 1740 }, { month: "Jun", rating: 1750 },
      { month: "Jul", rating: 1760 }, { month: "Aug", rating: 1770 }, { month: "Sep", rating: 1770 },
      { month: "Oct", rating: 1780 }, { month: "Nov", rating: 1780 }, { month: "Dec", rating: 1790 },
    ],
    tournamentHistory: [
      { id: "t6", tournamentName: "KiSC Grand Slam 2023", date: "2023-12-15", position: 1, totalPlayers: 40, points: 11, prize: "RWF 250,000" },
      { id: "t7", tournamentName: "Rwanda Open 2024", date: "2024-08-20", position: 3, totalPlayers: 64, points: 8, prize: "RWF 100,000" },
      { id: "t8", tournamentName: "National Championship 2024", date: "2024-06-20", position: 5, totalPlayers: 80, points: 5 },
      { id: "t9", tournamentName: "KiSC Monthly April", date: "2025-04-12", position: 1, totalPlayers: 32, points: 9, prize: "RWF 50,000" },
    ],
    achievements: [
      { id: "a5", title: "Coach of the Year", date: "2024-12-01", icon: "GraduationCap" },
      { id: "a6", title: "Best Defense", date: "2025-02-15", icon: "Shield" },
    ],
  },
  {
    memberName: "Jean-Pierre Habimana", bestWord: "PIANO", bestScore: 82, totalTournaments: 32,
    titles: ["Founder's Cup 2022", "KiSC Lifetime Achievement"],
    ratingHistory: [
      { month: "Jan", rating: 1710 }, { month: "Feb", rating: 1710 }, { month: "Mar", rating: 1700 },
      { month: "Apr", rating: 1720 }, { month: "May", rating: 1710 }, { month: "Jun", rating: 1720 },
      { month: "Jul", rating: 1720 }, { month: "Aug", rating: 1730 }, { month: "Sep", rating: 1720 },
      { month: "Oct", rating: 1720 }, { month: "Nov", rating: 1710 }, { month: "Dec", rating: 1720 },
    ],
    tournamentHistory: [
      { id: "t10", tournamentName: "Founder's Cup 2022", date: "2022-11-20", position: 1, totalPlayers: 32, points: 10, prize: "RWF 200,000" },
      { id: "t11", tournamentName: "KiSC Invitational 2023", date: "2023-09-15", position: 2, totalPlayers: 24, points: 7, prize: "RWF 100,000" },
      { id: "t12", tournamentName: "Rwanda Open 2023", date: "2023-08-20", position: 6, totalPlayers: 48, points: 4 },
      { id: "t13", tournamentName: "National Championship 2022", date: "2022-06-15", position: 3, totalPlayers: 64, points: 8, prize: "RWF 75,000" },
    ],
    achievements: [
      { id: "a7", title: "Founder's Cup Winner", date: "2022-11-20", icon: "Trophy" },
      { id: "a8", title: "Most Games Played", date: "2025-01-01", icon: "Activity" },
    ],
  },
];

const tournamentStandings = [
  { id: "ts1", tournamentName: "Rwanda Open 2025", date: "2025-08-15", position: 1, totalPlayers: 64, points: 12, prize: "RWF 500,000" },
  { id: "ts2", tournamentName: "KiSC Grand Slam 2024", date: "2024-12-10", position: 2, totalPlayers: 48, points: 10, prize: "RWF 300,000" },
  { id: "ts3", tournamentName: "National Championship", date: "2024-06-20", position: 3, totalPlayers: 80, points: 15, prize: "RWF 1,000,000" },
  { id: "ts4", tournamentName: "KiSC Monthly May", date: "2025-05-10", position: 4, totalPlayers: 36, points: 9, prize: "RWF 50,000" },
  { id: "ts5", tournamentName: "University League Finals", date: "2025-04-20", position: 5, totalPlayers: 40, points: 8 },
  { id: "ts6", tournamentName: "East African Championships", date: "2024-03-15", position: 6, totalPlayers: 32, points: 6 },
  { id: "ts7", tournamentName: "KiSC Invitational", date: "2024-09-10", position: 7, totalPlayers: 24, points: 5 },
  { id: "ts8", tournamentName: "School Scrabble Cup", date: "2025-02-28", position: 8, totalPlayers: 20, points: 4 },
];

const donors = [
  { name: "BK Group", amount: 10000000, tier: "platinum" },
  { name: "MTN Rwanda", amount: 5000000, tier: "platinum" },
  { name: "Rwanda Scrabble Federation", amount: 3000000, tier: "gold" },
  { name: "University of Rwanda", amount: 2000000, tier: "gold" },
  { name: "RwandAir", amount: 1500000, tier: "silver" },
  { name: "Kigali Marriott Hotel", amount: 1000000, tier: "silver" },
  { name: "Jean-Pierre Habimana", amount: 500000, tier: "bronze" },
  { name: "Alice Mukamana", amount: 300000, tier: "bronze" },
  { name: "Kigali Today", amount: 250000, tier: "bronze" },
  { name: "Patrick Mugisha", amount: 200000, tier: "bronze" },
  { name: "Grace Uwimana", amount: 100000, tier: "bronze" },
  { name: "David Niyonzima", amount: 25000, tier: "bronze" },
];

// ── Seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // 1. Admin user
  const password = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@kisc.rw" },
    update: {},
    create: { name: "Admin", email: "admin@kisc.rw", password, role: "admin" },
  });
  console.log("✓ Admin user: admin@kisc.rw / admin123");

  // 2. Settings (contact info)
  for (const [key, value] of Object.entries(contactInfo)) {
    if (key !== "socialLinks") {
      await prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } });
    }
  }
  for (const [key, value] of Object.entries(contactInfo.socialLinks)) {
    const settingKey = `social_${key}`;
    await prisma.setting.upsert({ where: { key: settingKey }, update: { value: String(value) }, create: { key: settingKey, value: String(value) } });
  }
  await prisma.setting.upsert({ where: { key: "clubName" }, update: { value: "Kimironko Scrabble Club" }, create: { key: "clubName", value: "Kimironko Scrabble Club" } });
  await prisma.setting.upsert({ where: { key: "tagline" }, update: { value: "Where words meet strategy" }, create: { key: "tagline", value: "Where words meet strategy" } });
  console.log("✓ Settings created");

  // 3. SiteContent sections
  const contentSections = [
    { section: "statCounters", content: JSON.stringify(statCounters) },
    { section: "coreValues", content: JSON.stringify(coreValues) },
    { section: "benefits", content: JSON.stringify(benefits) },
    { section: "historyMilestones", content: JSON.stringify(historyMilestones) },
    { section: "journeyMilestones", content: JSON.stringify(journeyMilestones) },
    { section: "contactInfo", content: JSON.stringify(contactInfo) },
    { section: "tournamentStandings", content: JSON.stringify(tournamentStandings) },
  ];
  for (const cs of contentSections) {
    await prisma.siteContent.upsert({ where: { section: cs.section }, update: { content: cs.content }, create: cs });
  }
  console.log("✓ SiteContent sections created");

  // 4. Event categories
  for (const ec of eventCategories) {
    await prisma.eventCategory.upsert({ where: { slug: ec.slug }, update: { count: ec.count }, create: ec });
  }
  console.log("✓ Event categories created");

  // 5. Team members
  const tmCount = await prisma.teamMember.count();
  if (tmCount === 0) {
    for (const tm of teamMembers) {
      await prisma.teamMember.create({
        data: { name: tm.name, role: tm.role, bio: tm.bio, avatar: tm.avatar, socialLinks: JSON.stringify(tm.socialLinks), order: tm.order },
      });
    }
    console.log("✓ Team members created");
  } else {
    console.log("→ Team members already exist, skipping");
  }

  // 6. Sponsorship packages
  const spCount = await prisma.sponsorshipPackage.count();
  if (spCount === 0) {
    for (const sp of sponsorshipPackages) {
      await prisma.sponsorshipPackage.create({
        data: { name: sp.name, price: sp.price, description: sp.description, benefits: JSON.stringify(sp.benefits), popular: sp.popular, order: sp.order },
      });
    }
    console.log("✓ Sponsorship packages created");
  } else {
    console.log("→ Sponsorship packages already exist, skipping");
  }

  // 7. Success stories
  for (const ss of successStories) {
    const existing = await prisma.successStory.findUnique({ where: { id: ss.id } });
    if (!existing) await prisma.successStory.create({ data: ss });
  }
  console.log("✓ Success stories created");

  // 8. Gallery items
  for (const gi of galleryItems) {
    const existing = await prisma.galleryItem.findUnique({ where: { id: gi.id } });
    if (!existing) {
      await prisma.galleryItem.create({ data: gi });
    }
  }
  console.log("✓ Gallery items created");

  // 9. Player profiles (link to members by name)
  const ppCount = await prisma.playerProfile.count();
  if (ppCount === 0) {
    const allMembers = await prisma.member.findMany();
    for (const pp of playerProfiles) {
      const member = allMembers.find((m) => m.name === pp.memberName);
      if (member) {
        await prisma.playerProfile.create({
          data: {
            memberId: member.id,
            bestWord: pp.bestWord,
            bestScore: pp.bestScore,
            totalTournaments: pp.totalTournaments,
            titles: JSON.stringify(pp.titles),
            ratingHistory: JSON.stringify(pp.ratingHistory),
            tournamentHistory: JSON.stringify(pp.tournamentHistory),
            achievements: JSON.stringify(pp.achievements),
          },
        });
      }
    }
    console.log("✓ Player profiles created");
  } else {
    console.log("→ Player profiles already exist, skipping");
  }

  // 10. Seed default gallery albums, events, products, partners, donations if empty
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    const events = [
      { title: "Kigali Scrabble Open 2026", slug: "kigali-scrabble-open-2026", description: "The premier Scrabble tournament in Kigali.", shortDescription: "Premier Scrabble tournament in Kigali", category: "tournament", startDate: new Date("2026-07-15"), endDate: new Date("2026-07-17"), location: "Kimironko Community Center, Kigali", status: "upcoming", maxParticipants: 64, featured: true },
      { title: "Schools Scrabble Championship", slug: "schools-scrabble-championship-2026", description: "Annual inter-school Scrabble competition.", shortDescription: "Annual inter-school competition", category: "tournament", startDate: new Date("2026-05-10"), location: "Lycée de Kigali", status: "upcoming", maxParticipants: 120, featured: true },
      { title: "Weekly Scrabble Night", slug: "weekly-scrabble-night-01", description: "Casual weekly Scrabble meetup.", shortDescription: "Casual weekly meetup", category: "meetup", startDate: new Date("2026-04-03"), location: "KiSC Clubhouse, Kimironko", status: "upcoming", featured: false },
      { title: "Rwanda Scrabble Championship 2025", slug: "rwanda-scrabble-championship-2025", description: "The national Scrabble championship.", shortDescription: "National championship 2025", category: "tournament", startDate: new Date("2025-12-01"), endDate: new Date("2025-12-03"), location: "Kigali Convention Center", status: "completed", maxParticipants: 80, featured: false },
    ];
    for (const e of events) {
      await prisma.event.upsert({ where: { slug: e.slug }, update: {}, create: e });
    }
    console.log("✓ Events created");
  } else {
    console.log("→ Events already exist, skipping");
  }

  const memberCount = await prisma.member.count();
  if (memberCount === 0) {
    const members = [
      { name: "Alice Mukamana", email: "alice@example.com", phone: "+250788111111", category: "individual", rating: 1850, gamesPlayed: 120, wins: 95 },
      { name: "Patrick Mugisha", email: "patrick@example.com", phone: "+250788444444", category: "individual", rating: 1790, gamesPlayed: 98, wins: 76 },
      { name: "Jean-Pierre Habimana", email: "jean@example.com", phone: "+250788555555", category: "individual", rating: 1720, gamesPlayed: 145, wins: 108 },
      { name: "Grace Uwimana", email: "grace@example.com", phone: "+250788333333", category: "individual", rating: 1680, gamesPlayed: 88, wins: 63 },
      { name: "David Niyonzima", email: "david@example.com", phone: "+250788222222", category: "individual", rating: 1650, gamesPlayed: 75, wins: 52 },
      { name: "Diane Ishimwe", email: "diane@example.com", phone: "+250788666666", category: "individual", rating: 1610, gamesPlayed: 62, wins: 42 },
    ];
    for (const m of members) {
      await prisma.member.upsert({ where: { email: m.email }, update: {}, create: m });
    }
    // Create rankings for members
    const newMembers = await prisma.member.findMany({ orderBy: { rating: "desc" } });
    for (let i = 0; i < newMembers.length; i++) {
      const m = newMembers[i];
      const losses = m.gamesPlayed - m.wins;
      await prisma.ranking.upsert({
        where: { rank: i + 1 },
        update: {},
        create: { memberId: m.id, rank: i + 1, rating: m.rating, gamesPlayed: m.gamesPlayed, wins: m.wins, losses, winRate: Math.round((m.wins / m.gamesPlayed) * 100 * 10) / 10, badge: i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : null },
      });
    }
    console.log("✓ Members + rankings created");
  } else {
    console.log("→ Members already exist, skipping");
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    const products = [
      { name: "KiSC Premium T-Shirt", slug: "kisc-premium-tshirt", description: "High-quality cotton t-shirt with embroidered KiSC logo.", shortDescription: "Cotton t-shirt with KiSC logo", price: 15000, category: "apparel", featured: true, inStock: true, stock: 50, images: JSON.stringify(["/shop/tshirt.jpg", "/shop/tshirt.jpg"]) },
      { name: "Scrabble Board (Deluxe)", slug: "scrabble-board-deluxe", description: "Official tournament-grade Scrabble board with rotating base.", shortDescription: "Tournament-grade deluxe board", price: 45000, comparePrice: 55000, category: "equipment", featured: true, inStock: true, stock: 15, images: JSON.stringify(["/shop/board.jpg", "/shop/board.jpg"]) },
      { name: "KiSC Cap", slug: "kisc-cap-2", description: "Adjustable cap with embroidered KiSC logo.", shortDescription: "Adjustable cap with KiSC logo", price: 10000, category: "apparel", featured: false, inStock: true, stock: 30, images: JSON.stringify(["/shop/cap.jpg", "/shop/cap.jpg"]) },
      { name: "KiSC Mug", slug: "kisc-mug", description: "Ceramic mug with KiSC branding.", shortDescription: "Ceramic mug with KiSC branding", price: 8000, category: "accessories", featured: false, inStock: true, stock: 40, images: JSON.stringify(["/shop/mug.jpg", "/shop/mug.jpg"]) },
    ];
    for (const p of products) {
      await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
    }
    console.log("✓ Products created");
  } else {
    console.log("→ Products already exist, skipping");
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    const partners = [
      { name: "BK Group", logo: "/partners/bk.png", description: "Premier financial institution and our title sponsor. BK Group's support has been instrumental in scaling our tournaments across Rwanda.", website: "https://bk.rw", type: "sponsor", tier: "platinum", spotlight: true, yearEstablished: 2021, stats: JSON.stringify([{ label: "Tournaments Sponsored", value: "12" }, { label: "Players Impacted", value: "800+" }]), order: 1, active: true },
      { name: "MTN Rwanda", logo: "/partners/mtn.png", description: "Leading telecommunications provider powering our digital platforms and providing connectivity for live-streamed events.", website: "https://mtn.rw", type: "sponsor", tier: "gold", spotlight: true, yearEstablished: 2022, stats: JSON.stringify([{ label: "Events Connected", value: "20+" }, { label: "Data Provided", value: "500GB+" }]), order: 2, active: true },
      { name: "Rwanda Scrabble Federation", logo: "/partners/rsf.png", description: "National governing body for Scrabble in Rwanda. Our strategic partner in growing the sport nationwide.", website: "https://rwandascrabble.rw", type: "partner", tier: "gold", yearEstablished: 2019, stats: JSON.stringify([{ label: "Joint Events", value: "15+" }, { label: "National Reach", value: "All Provinces" }]), order: 3, active: true },
      { name: "University of Rwanda", logo: "/partners/ur.png", description: "Partner university hosting inter-university Scrabble leagues and providing venues for major tournaments.", website: "https://ur.ac.rw", type: "partner", tier: "gold", yearEstablished: 2021, stats: JSON.stringify([{ label: "Campuses", value: "6" }, { label: "Student Players", value: "200+" }]), order: 4, active: true },
      { name: "Rwanda Today", logo: "/partners/today.png", description: "National media partner covering Scrabble events, player stories, and tournament highlights.", type: "media", tier: "silver", order: 5, active: true },
      { name: "Kigali Today", logo: "/partners/kt.png", description: "Community media partner providing local coverage of KiSC's school outreach programs.", type: "media", tier: "bronze", order: 6, active: true },
      { name: "RwandAir", logo: "/partners/today.png", description: "Official travel partner supporting our players' travel to regional and international tournaments.", website: "https://rwandair.com", type: "sponsor", tier: "silver", spotlight: true, order: 7, active: true },
      { name: "Kigali Marriott Hotel", logo: "/partners/bk.png", description: "Venue partner hosting our flagship tournaments and gala events.", website: "https://marriott.com", type: "partner", tier: "silver", order: 8, active: true },
    ];
    for (const p of partners) {
      const existing = await prisma.partner.findFirst({ where: { name: p.name } });
      if (!existing) await prisma.partner.create({ data: p });
    }
    console.log("✓ Partners created");
  } else {
    console.log("→ Partners already exist, skipping");
  }

  const donationCount = await prisma.donation.count();
  if (donationCount === 0) {
    for (const d of donors) {
      await prisma.donation.create({ data: { donorName: d.name, donorEmail: "donor@example.com", amount: d.amount, status: "completed" } });
    }
    console.log("✓ Donations created");
  } else {
    console.log("→ Donations already exist, skipping");
  }

  const galleryCount = await prisma.gallery.count();
  if (galleryCount === 0) {
    const albums = [
      { title: "Kigali Scrabble Open 2025", description: "Highlights from the 2025 Kigali Scrabble Open.", coverImage: "/gallery/open-2025.jpg", images: "[]", type: "photos" },
      { title: "Schools Outreach Program", description: "Visiting schools to promote Scrabble.", coverImage: "/gallery/school-outreach.jpg", images: "[]", type: "photos" },
      { title: "University League Finals", description: "University Scrabble League finals.", coverImage: "/gallery/university-finals.jpg", images: "[]", type: "photos" },
      { title: "Training Sessions", description: "Weekly training and strategy sessions.", coverImage: "/gallery/training.jpg", images: "[]", type: "videos" },
    ];
    for (const g of albums) {
      await prisma.gallery.create({ data: g });
    }
    console.log("✓ Gallery albums created");
  } else {
    console.log("→ Gallery already exists, skipping");
  }

  console.log("\n✓ Seed completed successfully!");
  console.log("  Admin: admin@kisc.rw / admin123");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
