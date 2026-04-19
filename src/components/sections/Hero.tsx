"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-dark marble-texture px-6 pt-24 md:pt-28">
      {/* Background pattern / placeholder for hero image */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #C9A96E 1px, transparent 1px), radial-gradient(circle at 80% 50%, #C9A96E 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <BrandLogo preset="hero" context="onLight" priority />
        </motion.div>

        <motion.h1
          className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-charcoal tracking-wide leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          Floral-Forward Event Styling
          <br />
          <span className="italic text-gold-dark">for Intimate Gatherings</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-md font-sans text-sm leading-relaxed text-charcoal-light tracking-wider"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Creating warm, elevated tablescapes and island designs
          <br className="hidden sm:block" />
          that bring your home — and your moments — to life.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          <Button href="/inquiry" variant="primary" size="lg">
            Start Your Inquiry
          </Button>
          <Button href="/services" variant="outline" size="lg">
            Explore Services
          </Button>
        </motion.div>

        <motion.p
          className="mt-6 font-sans text-xs tracking-[0.3em] uppercase text-charcoal-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Serving New Jersey &amp; Surrounding Areas
        </motion.p>

        <motion.p
          className="mt-6 font-serif italic text-lg md:text-xl text-gold-dark tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          Where flowers meet the table
        </motion.p>
      </div>
    </section>
  );
}
