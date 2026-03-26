"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { galleryImages } from "@/data/gallery";

export function GalleryTeaser() {
  const featured = galleryImages.slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {featured.map((image, i) => (
        <AnimateIn key={image.id} delay={i * 0.1}>
          <div className="group relative aspect-square overflow-hidden bg-cream-dark cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-sm text-charcoal-light/30 italic text-center px-4">
                {image.alt}
              </span>
            </div>
            <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
          </div>
        </AnimateIn>
      ))}
    </div>
  );
}
