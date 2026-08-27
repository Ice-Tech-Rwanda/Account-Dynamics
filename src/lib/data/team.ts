export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image?: string;
}

export const founder: TeamMember = {
  name: "Joseph P. Mathews",
  role: "Founder, CEO & CFO",
  bio: "Joseph Mathews is a Registered Professional Accountant and a member of the Society of Professional Accountants of Canada. He is also a Certified Accounting Practitioner and has successfully completed the 2-year CICA In-depth Tax Course, qualifying as a Tax Specialist from the Institute of Chartered Accountants of Canada (now Chartered Professional Accountants of Ontario). Joseph holds associate memberships with the National Association of Certified Valuation Analysts (CVA), Institute of Certified Management Accountants ANZ (CMA & CGBA), Institute of Certified Public Accountants of Rwanda (CPA), American Institute of Certified Public Accountants, CPA Australia, The Institute of Chartered Accountants of India (CA), and The Institute of Cost Accountants of India (CMA).",
  expertise: [
    "Bookkeeping & Accounting",
    "Financial Statement Preparation",
    "Compilation Engagement Reports",
    "Personal & Corporate Tax Returns",
    "Business Plans for Financing",
    "Tax Planning & Minimization",
    "CRA Tax Audits & Appeals",
  ],
  image: "/team/joseph-mathews.jpg",
};

export const teamMembers: TeamMember[] = [
  {
    name: "Rishi",
    role: "Manager",
    bio: "Rishi has been a valuable member of the team since 2014. With a background in hospitality and over 2 years of study and work experience from London, UK, Rishi brings a unique perspective to analyzing businesses and their specific bookkeeping and accounting requirements. His business family background further enhances his ability to understand the distinct needs of our clients.",
    expertise: ["Business Analytics", "CRA Audits", "Client On-boarding", "Business Plans", "Business Processes"],
    image: "/team/rishi.jpg",
  },
  {
    name: "Amrit",
    role: "Office Manager",
    bio: "Amrit has been with Joseph Mathews & Associates Inc since 2002 and currently with Account Dynamics Inc. She is a Certified ProAdvisor (QuickBooks) with a Bachelor of Arts Degree and Business Administration and Tax and Accounting Diploma from Toronto School of Business. With over 20 years of experience in corporation and personal tax returns and all statutory filing requirements per the Canada Revenue Agency (CRA), Amrit coordinates and follows up for information and documents between clients, the India office and Toronto office.",
    expertise: ["QuickBooks ProAdvisor", "Corporate Tax Returns", "Personal Tax Returns", "CRA Compliance"],
    image: "/team/amrit.jpg",
  },
  {
    name: "Yogesh",
    role: "Accounts Supervisor",
    bio: "Yogesh is a Certified ProAdvisor (QuickBooks) with a Master's Degree in Commerce and Bachelor's degree in Indian Laws from India. He has around 12 years of experience in bookkeeping, accounting and tax preparations.",
    expertise: ["Bookkeeping", "Accounting", "Tax Preparations", "QuickBooks ProAdvisor"],
    image: "/team/yogesh.jpg",
  },
  {
    name: "Hari",
    role: "Bookkeeping & Payroll Supervisor",
    bio: "A dedicated professional with over 30 years of diverse work experience. As a Bookkeeping Supervisor and Payroll Specialist, he excels in providing exceptional services to Canadian clients. Through daily client engagement and collaboration with the onshore team, Hari maintains strong relationships and upholds data security.",
    expertise: ["Bookkeeping", "Payroll", "QuickBooks", "Client Relations", "Data Security"],
    image: "/team/hari.jpg",
  },
  {
    name: "Nikhil",
    role: "IT",
    bio: "Results-driven UI/UX designer with experience in creating intuitive and visually appealing interfaces. Proficient in HTML, CSS, JavaScript, React, Node.js, and PostgreSQL, bringing a solid technical foundation to design projects.",
    expertise: ["UI/UX Design", "Web Development", "React", "Node.js"],
    image: "/team/nikhil.jpg",
  },
];
