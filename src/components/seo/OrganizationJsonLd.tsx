import { SITE_URL, absoluteUrl } from "@/lib/site";
import { socialLinks } from "@/data/navigation";

/**
 * Organization structured data, rendered once in the root layout. Only
 * verifiable facts are included — no address, phone, hours, ratings, or
 * pricing (Fork & Flower is a traveling service with no storefront).
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fork & Flower Designs",
    url: SITE_URL,
    logo: absoluteUrl("/logo-512.png"),
    image: absoluteUrl("/og-image.png"),
    description:
      "Floral-forward event styling for intimate at-home gatherings, including elevated tablescapes, island designs, and custom floral artistry throughout New Jersey and surrounding areas.",
    email: "events@forkandflowerdesigns.com",
    areaServed: "New Jersey and surrounding areas",
    sameAs: [socialLinks.instagram],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, static, server-rendered content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
