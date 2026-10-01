import { Heart, ShieldCheck, Users, Leaf, Award, Compass } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion for Tourism",
    description:
      "We are driven by a genuine love for Rwanda's wildlife, landscapes and culture — and we share that passion with every traveller we serve.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Excellence",
    description:
      "From tour planning to guiding and customer service, we hold ourselves to the highest standards of professionalism and care.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "Our guests, our team and our communities come first. We build relationships based on trust, respect and genuine human connection.",
  },
  {
    icon: Leaf,
    title: "Responsible Travel",
    description:
      "We are committed to tourism that protects the environment, supports local communities and preserves Rwanda's natural heritage for future generations.",
  },
  {
    icon: Award,
    title: "Quality & Integrity",
    description:
      "We deliver what we promise. Our reputation is built on honesty, transparency and consistently exceptional service.",
  },
  {
    icon: Compass,
    title: "Continuous Learning",
    description:
      "We invest in our team's growth through accredited training, mentorship and hands-on experience — because better people create better journeys.",
  },
];

export function CompanyValues() {
  return (
    <section className="safari-section">
      <div className="safari-container">
        <div className="editorial-heading">
          <div>
            <div className="safari-eyebrow">
              <span className="safari-eyebrow-line" />
              <span>What Drives Us</span>
            </div>
            <h2>Our Core Values</h2>
          </div>
          <p>
            These principles guide every decision we make, every journey we
            design and every relationship we build.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-brand/20 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5 text-brand transition-transform group-hover:scale-110 dark:bg-brand/10 dark:text-accent">
                <value.icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
