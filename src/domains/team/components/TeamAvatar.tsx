import Image from "next/image";
import { siteImages } from "@/lib/siteImages";
import type { SiteImages } from "@/lib/siteImages";

export type TeamSlug = keyof SiteImages["team"];

interface TeamAvatarProps {
  slug: TeamSlug;
  /** Avatar box size in pixels. Defaults to 64. */
  size?: number;
  /** Show a "Photo coming soon" caption under the avatar. Defaults to false. */
  showLabel?: boolean;
}

export function TeamAvatar({ slug, size = 64, showLabel = false }: TeamAvatarProps) {
  const avatar = siteImages.team[slug];
  const hasImage = Boolean(avatar.src);

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      {hasImage ? (
        <Image
          src={avatar.src as string}
          alt={`${avatar.name}, team member at Account Dynamics`}
          width={size}
          height={size}
          className="rounded-xl object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          role="img"
          aria-label={`${avatar.name}, team member at Account Dynamics`}
          className="flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/70 text-white font-bold shadow-sm"
          style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
        >
          {avatar.initials}
        </div>
      )}
      {showLabel && (
        <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          Photo coming soon
        </span>
      )}
    </div>
  );
}
