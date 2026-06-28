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
import { usePhotoTap } from "@/hooks/usePhotoTap";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";

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
  onOpen: () => void;
}) {
  const handlers = usePhotoTap(onOpen);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group cursor-pointer"
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handleSelectCategory = (value: GalleryCategory) => {
    setLightboxIndex(null);
    setActiveCategory(value);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 md:mb-14">
        {galleryCategories.map((cat) => (
          <FilterButton
            key={cat.value}
            cat={cat}
            isActive={activeCategory === cat.value}
            onSelect={handleSelectCategory}
          />
        ))}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, i) => (
            <GalleryTile
              key={image.id}
              image={image}
              onOpen={() => setLightboxIndex(i)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <PhotoLightbox
        photos={filteredImages.map((img) => ({ src: img.src, alt: img.alt }))}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
