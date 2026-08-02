"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, FileText, Download, Video, ArrowRight, Clock, User, DownloadCloud, Star } from "lucide-react";
import type { Resource } from "@/domains/resources/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const categoryMeta = {
  guide: { icon: BookOpen, label: "Guide", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  article: { icon: FileText, label: "Article", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  tutorial: { icon: Video, label: "Tutorial", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  download: { icon: Download, label: "Download", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
};

interface Props {
  resource: Resource
  index: number
  compact?: boolean
}

export function ResourceCard({ resource, index, compact }: Props) {
  const meta = categoryMeta[resource.category];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${compact ? "flex items-center gap-4 p-4" : ""}`}
    >
      {compact ? (
        <>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.color}`}>
            <Icon className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors truncate">
              {resource.title}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{resource.description}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-shrink-0">
            <span className="flex items-center gap-0.5"><Clock className="size-2.5" /> {resource.readTime}</span>
            {resource.category === "download" && resource.fileUrl && (
              <a href={`/api/resources/download?resourceId=${resource.id}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all">
                <DownloadCloud className="size-3" />
              </a>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Image */}
          <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {resource.image ? (
              <Image src={resource.image} alt={resource.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Icon className="size-10 text-slate-300 dark:text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${meta.color}`}>
                <Icon className="size-2.5" /> {meta.label}
              </span>
            </div>

            {resource.popular && (
              <div className="absolute top-3 right-3">
                <Badge variant="accent" className="text-[8px] uppercase tracking-wider shadow-md flex items-center gap-0.5">
                  <Star className="size-2.5" /> Popular
                </Badge>
              </div>
            )}

            {/* Video play overlay */}
            {resource.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Video className="size-5 text-brand ml-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            {/* Tags */}
            {resource.tags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[8px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug">
              {resource.title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {resource.description}
            </p>

            {/* Author + Meta */}
            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
              <User className="size-3" />
              <span className="truncate">{resource.author}</span>
              {resource.authorRole && (
                <>
                  <span>·</span>
                  <span className="truncate text-slate-500">{resource.authorRole}</span>
                </>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5"><Clock className="size-2.5" /> {resource.readTime}</span>
                {resource.downloadCount && (
                  <span className="flex items-center gap-0.5"><DownloadCloud className="size-2.5" /> {resource.downloadCount}</span>
                )}
              </div>
              <span>{formatDate(resource.publishedAt ?? "")}</span>
            </div>

            <div className="mt-3 flex gap-2">
              {resource.category === "download" && resource.fileUrl ? (
                <a href={`/api/resources/download?resourceId=${resource.id}`} className="flex-1">
                  <Button variant="brand" size="sm" className="w-full rounded-xl text-[10px] gap-1.5">
                    <DownloadCloud className="size-3.5" /> Download
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] gap-1 text-brand font-bold hover:text-brand-soft">
                  Read More <ArrowRight className="size-3" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}