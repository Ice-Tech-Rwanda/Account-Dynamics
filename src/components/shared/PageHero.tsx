import Image from "next/image";
import Link from "next/link";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  breadcrumb?: { label: string; href: string }[];
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="safari-page-hero">
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="hero-photograph"
      />
      <div className="hero-shade" />
      <div className="safari-container page-hero-content">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="safari-breadcrumb">
            <Link href="/">Home</Link>
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.href}>
                <span aria-hidden="true"> / </span>
                {index === breadcrumb.length - 1 ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="safari-eyebrow">
            <span className="safari-eyebrow-line" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1>{title}</h1>
        {description && <p className="page-hero-description">{description}</p>}
      </div>
    </section>
  );
}
