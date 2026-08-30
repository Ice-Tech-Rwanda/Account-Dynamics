import { getSiteSettings } from "@/lib/content/service.server";
import { ContactHero } from "@/domains/contact/components/ContactHero";
import { ContactForm } from "@/domains/contact/components/ContactForm";
import { CTASection } from "@/domains/home/components/CTASection";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Account Dynamics for accounting, tax, advisory and business analytics services in Toronto.",
  openGraph: {
    title: "Contact | Account Dynamics",
    description: "Get in touch with Account Dynamics.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="overflow-x-hidden">
      <ContactHero />
      <ContactForm />
      <CTASection />
    </div>
  );
}
