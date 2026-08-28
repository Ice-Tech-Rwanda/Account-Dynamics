import { siteConfig } from "@/lib/site";
import { ContactHero } from "@/domains/contact/components/ContactHero";
import { ContactForm } from "@/domains/contact/components/ContactForm";
import { ContactInformation } from "@/domains/contact/components/ContactInformation";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Account Dynamics for professional accounting, tax, advisory and business analytics services in Toronto, Canada.",
  openGraph: {
    title: "Contact Us | Account Dynamics",
    description:
      "Get in touch with Account Dynamics for professional accounting, tax, advisory and business analytics services.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteUrl,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "55 Baywood Road, 2nd Floor",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      postalCode: "M9V 3Y8",
      addressCountry: "CA",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "16:00",
    },
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContactHero />
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInformation />
          </div>
        </div>
      </section>
    </div>
  );
}
