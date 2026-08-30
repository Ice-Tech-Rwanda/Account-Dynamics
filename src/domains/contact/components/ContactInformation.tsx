import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ContactLine = { text: string; href?: string };

const contactDetails: { icon: React.ElementType; label: string; lines: ContactLine[] }[] = [
  {
    icon: Phone,
    label: "Phone",
    lines: [
      { text: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/-/g, "")}` },
      { text: siteConfig.phoneSecondary, href: `tel:${siteConfig.phoneSecondary?.replace(/-/g, "")}` },
    ],
  },
  {
    icon: MapPin,
    label: "Address",
    lines: [
      { text: "55 Baywood Road, 2nd Floor" },
      { text: "Toronto, Ontario M9V 3Y8" },
    ],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: [
      { text: "Monday – Friday" },
      { text: "9:00 AM – 4:00 PM" },
    ],
  },
  {
    icon: Mail,
    label: "Email",
    lines: [
      { text: siteConfig.email, href: `mailto:${siteConfig.email}` },
    ],
  },
];

export function ContactInformation() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Get in Touch
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        If we can be of any help, please contact us by email, phone, or visit us
        at our office.
      </p>

      <div className="mt-8 space-y-6">
        {contactDetails.map((detail) => (
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
                  line.href ? (
                    <a
                      key={i}
                      href={line.href}
                      className="block text-sm text-slate-500 dark:text-slate-400 hover:text-brand transition-colors"
                    >
                      {line.text}
                    </a>
                  ) : (
                    <p key={i} className="text-sm text-slate-500 dark:text-slate-400">
                      {line.text}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Online CTA */}
      <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Prefer to Book Online?
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Schedule a consultation directly through our online booking system.
        </p>
        <Link
          href={siteConfig.bookOnlineUrl}
          className="mt-4 inline-block"
        >
          <Button variant="brand" className="gap-2 rounded-xl">
            Book Online
          </Button>
        </Link>
      </div>
    </div>
  );
}
