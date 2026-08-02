"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Twitter, Linkedin, Mail, Quote } from "lucide-react";
import { siteConfig } from "@/lib/site";

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  socialLinks?: Record<string, string>
}

const socialIcons: Record<string, React.ElementType> = {
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
};

export function LeadershipTeam({ teamMembers }: { teamMembers: TeamMember[] }) {
  return (
    <section id="leadership" className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Team</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Leadership Team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Meet the dedicated team driving {siteConfig.name}&apos;s mission forward.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-brand/30 transition-all duration-500">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={112}
                        height={112}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand border-2 border-white dark:border-slate-900 flex items-center justify-center">
                      <Quote className="size-3 text-white" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                    {member.name}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                    {member.role}
                  </span>

                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {member.socialLinks && (
                    <div className="mt-5 flex items-center gap-2">
                      {Object.entries(member.socialLinks).map(([platform, url]) => {
                        if (!url || url === "#") return null;
                        const Icon = socialIcons[platform] || Mail;
                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            target={platform === "email" ? undefined : "_blank"}
                            rel={platform === "email" ? undefined : "noopener noreferrer"}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-brand hover:text-white transition-all duration-300"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Icon className="size-3.5" />
                          </motion.a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
