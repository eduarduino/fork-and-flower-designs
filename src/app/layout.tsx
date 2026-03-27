import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  title: {
    default: "Fork & Flower Designs | Floral-Forward Event Styling",
    template: "%s | Fork & Flower Designs",
  },
  description:
    "Floral-forward event styling for intimate at-home gatherings. Creating warm, elevated tablescapes and island designs in New Jersey & surrounding areas.",
  keywords: [
    "event styling",
    "tablescaping",
    "floral design",
    "island styling",
    "home entertaining",
    "dinner party styling",
    "New Jersey event styling",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fork & Flower Designs",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
