import { siteConfig } from "@/lib/site";
import { BookingHero } from "@/domains/booking/components/BookingHero";
import { BookingForm } from "@/domains/booking/components/BookingForm";
import { Phone, Clock, Calendar, Mail } from "lucide-react";

export const metadata = {
  title: "Book a Consultation",
  description:
    "Book a consultation with Account Dynamics for professional accounting, tax, advisory and business analytics services in Toronto, Canada.",
  openGraph: {
    title: "Book a Consultation | Account Dynamics",
    description:
      "Schedule a consultation with Account Dynamics for professional accounting, tax, advisory and business analytics services.",
    url: "/book",
  },
  alternates: {
    canonical: "/book",
  },
};

export default function BookPage() {
  const details = [
    {
      icon: Phone,
      label: "Prefer to Call?",
      lines: [siteConfig.phone, siteConfig.phoneSecondary || ""],
      href: `tel:${siteConfig.phone.replace(/-/g, "")}`,
    },
    {
      icon: Clock,
      label: "Office Hours",
      lines: ["Monday – Friday", "9:00 AM – 4:00 PM"],
    },
    {
      icon: Calendar,
      label: "How It Works",
      lines: ["Request a time that suits you.", "We confirm within one business day.", "Meet in person or virtually."],
    },
    {
      icon: Mail,
      label: "Email",
      lines: [siteConfig.email],
      href: `mailto:${siteConfig.email}`,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <BookingHero />
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <BookingForm />

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Booking Details
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                A few things to know before your consultation.
              </p>

              <div className="mt-8 space-y-6">
                {details.map((detail) => (
                  <div key={detail.label} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand/5 dark:bg-brand/10 flex items-center justify-center text-brand">
                      <detail.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {detail.label}
                      </h3>
                      <div className="mt-1 space-y-0.5">
                        {detail.lines.map((line, i) =>
                          line && detail.href && i === 0 ? (
                            <a
                              key={i}
                              href={detail.href}
                              className="block text-sm text-slate-500 dark:text-slate-400 hover:text-brand transition-colors"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={i} className="text-sm text-slate-500 dark:text-slate-400">
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
