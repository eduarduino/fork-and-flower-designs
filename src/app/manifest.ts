import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fork & Flower Designs",
    short_name: "Fork & Flower",
    description:
      "Floral-forward event styling for intimate at-home gatherings throughout New Jersey and surrounding areas.",
    start_url: "/",
    display: "standalone",
    theme_color: "#3A320C",
    background_color: "#F3EBE4",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
