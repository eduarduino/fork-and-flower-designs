"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import {
  packageCategories,
  fullHomeExperience,
  premiumAddOns,
  type Package,
} from "@/data/packages";

/* ───────────────────── Detail Modal ───────────────────── */

function PackageDetailModal({
  pkg,
  onClose,
}: {
  pkg: Package;
  onClose: () => void;
}) {
  // Close on Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Card */}
      <motion.div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-cream-dark p-8 md:p-10 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal-light hover:text-charcoal transition-colors"
          aria-label="Close details"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        <h3 className="font-serif text-2xl md:text-3xl tracking-wide text-charcoal">
          {pkg.name}
        </h3>
        <p className="mt-2 font-sans text-xs tracking-wider text-gold uppercase">
          {pkg.description}
        </p>

        <div className="h-px bg-cream-dark my-6" />

        {pkg.detailedDescription && (
          <p className="font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
            {pkg.detailedDescription}
          </p>
        )}

        <div className="h-px bg-cream-dark my-6" />

        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal mb-4">
          What&apos;s Included
        </p>
        <ul className="space-y-3">
          {pkg.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 font-sans text-xs tracking-wider text-charcoal-light"
            >
              <span className="mt-0.5 text-gold text-sm">✦</span>
              {item}
            </li>
          ))}
        </ul>

        {pkg.perfectFor && (
          <p className="mt-6 font-serif text-sm italic text-charcoal-light/80">
            {pkg.perfectFor}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────── Package Card ───────────────────── */

function PackageCard({
  pkg,
  onViewDetails,
}: {
  pkg: Package;
  onViewDetails?: (pkg: Package) => void;
}) {
  return (
    <div
      className={`relative flex flex-col h-full p-8 md:p-10 border transition-all duration-300 hover:shadow-lg ${
        pkg.highlighted
          ? "border-gold bg-cream-dark"
          : "border-cream-dark bg-white hover:border-gold/50"
      }`}
    >
      <h3 className="font-serif text-2xl tracking-wide text-charcoal">
        {pkg.name}
      </h3>
      <p className="mt-2 font-sans text-xs tracking-wider text-charcoal-light">
        {pkg.description}
      </p>

      <div className="h-px bg-cream-dark my-6" />

      <ul className="space-y-3 flex-1">
        {pkg.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 font-sans text-xs tracking-wider text-charcoal-light"
          >
            <span className="mt-0.5 text-gold text-sm">✦</span>
            {item}
          </li>
        ))}
      </ul>

      {pkg.perfectFor && (
        <p className="mt-6 font-serif text-sm italic text-charcoal-light/80">
          {pkg.perfectFor}
        </p>
      )}

      {pkg.detailedDescription && onViewDetails && (
        <button
          onClick={() => onViewDetails(pkg)}
          className="mt-6 self-start font-sans text-xs tracking-wider text-gold hover:text-charcoal transition-colors border-b border-gold/40 hover:border-charcoal/40 pb-0.5"
        >
          View Full Details
        </button>
      )}
    </div>
  );
}

/* ───────────────────── Main Export ───────────────────── */

export function PackageCards() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  return (
    <>
      <div className="space-y-16">
        {packageCategories.map((category) => (
          <div key={category.category}>
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide text-center mb-10">
              {category.category}
            </h3>
            <StaggerChildren
              className="grid gap-8 md:grid-cols-3"
              staggerDelay={0.15}
            >
              {category.packages.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <PackageCard pkg={pkg} onViewDetails={setSelectedPkg} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        ))}

        {/* Full Home Experience */}
        <div>
          <h3 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide text-center mb-10">
            The Full Home Experience
          </h3>
          <div className="mx-auto max-w-lg">
            <PackageCard pkg={fullHomeExperience} onViewDetails={setSelectedPkg} />
          </div>
        </div>

        {/* Premium Add-Ons */}
        <div>
          <h3 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide text-center mb-10">
            Premium Add-Ons
          </h3>
          <StaggerChildren
            className="grid gap-8 md:grid-cols-2"
            staggerDelay={0.1}
          >
            {premiumAddOns.map((addon) => (
              <StaggerItem key={addon.name}>
                <div className="flex flex-col h-full p-8 md:p-10 border border-cream-dark bg-white hover:border-gold/50 transition-all duration-300 hover:shadow-lg">
                  <h4 className="font-serif text-2xl tracking-wide text-charcoal">
                    {addon.name}
                  </h4>
                  <div className="h-px bg-cream-dark my-6" />
                  <p className="font-sans text-xs tracking-wider text-charcoal-light leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPkg && (
          <PackageDetailModal
            pkg={selectedPkg}
            onClose={() => setSelectedPkg(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
