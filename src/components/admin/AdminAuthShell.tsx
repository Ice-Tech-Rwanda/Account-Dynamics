import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";

export function AdminAuthShell({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <div className="admin-auth">
      <aside className="admin-auth-story" aria-label="Global Line Safaris">
        <Image src="/images/lake-ruhondo.jpg" alt="" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
        <div className="admin-auth-story-copy">
          <p className="admin-eyebrow">Rwanda &amp; beyond</p>
          <h2>Extraordinary journeys.<br />Thoughtfully managed.</h2>
          <p>Behind every unforgettable safari is a team that cares about the details.</p>
        </div>
        <span className="admin-auth-caption">GLOBAL LINE SAFARIS / TEAM WORKSPACE</span>
      </aside>
      <section className="admin-auth-panel">
        <Link href="/" className="admin-back-link"><ArrowLeft width={16} height={16} /> Back to website</Link>
        <div className="admin-auth-form">
          <Logo showWordmark={false} />
          <p className="admin-eyebrow">Your safari workspace</p>
          <h1>{title}</h1>
          <p className="admin-auth-description">{description}</p>
          {children}
          <p className="admin-auth-security"><ShieldCheck width={15} height={15} /> Secure access for the Global Line Safaris team</p>
        </div>
        <p className="admin-auth-copyright">&copy; {new Date().getFullYear()} {siteConfig.productName}</p>
      </section>
    </div>
  );
}
