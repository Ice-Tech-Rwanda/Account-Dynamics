import { redirect } from "next/navigation";

export const metadata = {
  title: "Plan Your Trip",
  description:
    "Plan a tailor-made safari or tour in Rwanda and East Africa with Global Line Safaris.",
  alternates: {
    canonical: "/plan-your-trip",
  },
};

export default function BookPage() {
  redirect("/plan-your-trip");
}
