import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForkStabProvider } from "@/components/providers/ForkStabProvider";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const DESCRIPTION =
  "Floral-forward event styling for intimate at-home gatherings, including elevated tablescapes, island designs, and custom floral artistry throughout New Jersey and surrounding areas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fork & Flower Designs | Floral-Forward Event Styling",
    template: "%s | Fork & Flower Designs",
  },
  description: DESCRIPTION,
  keywords: [
    "event styling",
    "tablescaping",
    "floral design",
    "island styling",
    "home entertaining",
    "dinner party styling",
    "New Jersey event styling",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fork & Flower Designs",
    url: "/",
    title: "Fork & Flower Designs | Floral-Forward Event Styling",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fork & Flower Designs floral-forward event styling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fork & Flower Designs | Floral-Forward Event Styling",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        <OrganizationJsonLd />
        <ForkStabProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ForkStabProvider>
      </body>
    </html>
  );
}
