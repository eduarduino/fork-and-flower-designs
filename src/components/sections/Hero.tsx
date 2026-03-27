"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-dark marble-texture px-6">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4 block">
            Floral-Forward Event Styling
          </span>
        </motion.div>

        <motion.h1
          className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-charcoal tracking-wide leading-tight"
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

        <motion.div
          className="mx-auto mt-6 h-px w-16 bg-gold/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        />

        <motion.p
          className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          Serving New Jersey &amp; Surrounding Areas
        </motion.p>
      </div>
    </section>
  );
}
