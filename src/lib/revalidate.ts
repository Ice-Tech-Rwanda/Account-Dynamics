import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

const CONTENT_TAGS = [
  "settings",
  "services",
  "team",
  "industries",
  "faqs",
  "homepage",
  "media",
  "membership",
  "software",
] as const;

/** Invalidates all CMS caches + public routes after an admin mutation. */
export function revalidateSite() {
  for (const tag of CONTENT_TAGS) {
    try {
      revalidateTag(tag, "default");
    } catch {
      // Tags are best-effort; path revalidation below is the source of truth.
    }
  }
  for (const path of [
    "/",
    "/about",
    "/services",
    "/services/[slug]",
    "/industries",
    "/why-choose-us",
    "/contact",
    "/book",
  ]) {
    try {
      revalidatePath(path, path.includes("[") ? "page" : "layout");
    } catch {
      // ignore
    }
  }
  try {
    revalidatePath("/", "layout");
  } catch {
    // ignore
  }
}

export { CONTENT_TAGS };