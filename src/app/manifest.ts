import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "GLS",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2e9",
    theme_color: "#214d3b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}