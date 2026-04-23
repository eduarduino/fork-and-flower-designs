"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  galleryImages,
  galleryCategories,
  type GalleryCategory,
} from "@/data/gallery";
import { useForkAnimatedAction } from "@/hooks/useForkAnimatedAction";

type FilterCategory = (typeof galleryCategories)[number];
type GalleryImageEntry = (typeof galleryImages)[number];

function FilterButton({
  cat,
  isActive,
  onSelect,
}: {
  cat: FilterCategory;
  isActive: boolean;
  onSelect: (value: GalleryCategory) => void;
}) {
  const handlers = useForkAnimatedAction({
    mode: "action",
    action: () => onSelect(cat.value),
  });
  return (
    <button
      onPointerDown={handlers.onPointerDown}
      onClick={handlers.onClick}
      className={`font-sans text-xs sm:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 py-2 px-1 border-b ${
        isActive
          ? "text-charcoal border-gold"
          : "text-charcoal-light border-transparent hover:text-charcoal hover:border-charcoal/20"
      }`}
    >
      {cat.label}
    </button>
  );
}

function GalleryTile({
  image,
  onOpen,
}: {
  image: GalleryImageEntry;
  onOpen: (id: string) => void;
}) {
  const handlers = useForkAnimatedAction({
    mode: "action",
    action: () => onOpen(image.id),
  });
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group cursor-pointer"
      onPointerDown={handlers.onPointerDown}
      onClick={handlers.onClick}
    >
      <div className="relative overflow-hidden bg-cream-dark aspect-[4/5]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
      </div>
    </motion.div>
  );
}

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const lightboxEntry = lightboxImage
    ? galleryImages.find((img) => img.id === lightboxImage)
    : null;

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 md:mb-14">
        {galleryCategories.map((cat) => (
          <FilterButton
            key={cat.value}
            cat={cat}
            isActive={activeCategory === cat.value}
            onSelect={setActiveCategory}
          />
        ))}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image) => (
            <GalleryTile
              key={image.id}
              image={image}
              onOpen={setLightboxImage}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxEntry && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[85vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxEntry.src}
                alt={lightboxEntry.alt}
                width={lightboxEntry.src.width}
                height={lightboxEntry.src.height}
                sizes="(max-width: 1024px) 90vw, 896px"
                className="h-auto max-h-[85vh] w-auto mx-auto object-contain"
              />

              {/* Close */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-2 -right-2 md:top-2 md:right-2 bg-charcoal/60 hover:bg-charcoal/80 text-cream rounded-full p-2 transition-colors"
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
