import { PageHero } from "@/components/shared/PageHero";
import type { ServiceCategory } from "@/lib/content/types";
import { siteImages } from "@/lib/siteImages";
export function ServiceDetailHero({ category }: {category: ServiceCategory}) { return <PageHero eyebrow="Travel Services" title={category.title} description={category.description} image={category.image || siteImages.servicesHero.src} breadcrumb={[{label:"Services",href:"/services"},{label:category.title,href:`/services/${category.slug}`}]} />; }
