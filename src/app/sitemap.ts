import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const ROUTES = [
  "/",
  "/about",
  "/how-it-works",
  "/services",
  "/packages",
  "/gallery",
  "/inquiry",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
