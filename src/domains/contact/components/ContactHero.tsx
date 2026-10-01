import { PageHero } from "@/components/shared/PageHero";
import { siteImages } from "@/lib/siteImages";
export function ContactHero() { return <PageHero eyebrow="We'd love to hear from you" title="Let’s Start a Conversation" description="Share your ideas, ask a question, or tell us where you’d love to go. Our team is here to help you plan your journey." image={siteImages.advisory.src} breadcrumb={[{label:"Contact",href:"/contact"}]} />; }
