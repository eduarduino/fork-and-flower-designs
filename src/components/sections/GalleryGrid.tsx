"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  galleryImages,
  galleryCategories,
  type GalleryCategory,
} from "@/data/gallery";

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 md:mb-14">
        {galleryCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b ${
              activeCategory === cat.value
                ? "text-charcoal border-gold"
                : "text-charcoal-light border-transparent hover:text-charcoal hover:border-charcoal/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="group cursor-pointer"
              onClick={() => setLightboxImage(image.id)}
            >
              <div
                className={`relative overflow-hidden bg-cream-dark ${
                  image.aspect === "portrait"
                    ? "aspect-[3/4]"
                    : image.aspect === "landscape"
                    ? "aspect-[4/3]"
                    : "aspect-square"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <span className="font-serif text-sm text-charcoal-light/30 italic text-center">
                    {image.alt}
                  </span>
                </div>
                <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-cream-dark aspect-[4/3] flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-serif text-lg text-charcoal-light/40 italic">
                {galleryImages.find((img) => img.id === lightboxImage)?.alt}
              </span>

              {/* Close */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 text-charcoal-light hover:text-charcoal transition-colors"
                aria-label="Close lightbox"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
