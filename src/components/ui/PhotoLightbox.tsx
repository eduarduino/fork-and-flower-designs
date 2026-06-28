"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxPhoto {
  src: StaticImageData;
  alt: string;
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  /** Index of the open photo, or null when the lightbox is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const isOpen = index !== null && index >= 0 && index < photos.length;
  const hasMultiple = photos.length > 1;
  const isFirst = index === 0;
  const isLast = index !== null && index === photos.length - 1;

  const goNext = useCallback(() => {
    if (index === null || index >= photos.length - 1) return;
    onIndexChange(index + 1);
  }, [index, photos.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (index === null || index <= 0) return;
    onIndexChange(index - 1);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, goNext, goPrev, onClose]);

  const photo = isOpen ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key={index}
            className="relative max-w-4xl w-full max-h-[85vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.src.width}
              height={photo.src.height}
              sizes="(max-width: 1024px) 90vw, 896px"
              className="h-auto max-h-[85vh] w-auto mx-auto object-contain"
            />

            {/* Close */}
            <button
              onClick={onClose}
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

            {hasMultiple && (
              <>
                {/* Previous */}
                <button
                  onClick={goPrev}
                  disabled={isFirst}
                  className="absolute left-1 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-charcoal/60 hover:bg-charcoal/80 text-cream rounded-full p-2 transition-all disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Previous photo"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  onClick={goNext}
                  disabled={isLast}
                  className="absolute right-1 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-charcoal/60 hover:bg-charcoal/80 text-cream rounded-full p-2 transition-all disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Next photo"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>

                {/* Position indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-charcoal/60 text-cream rounded-full px-3 py-1 font-sans text-[11px] tracking-[0.2em] tabular-nums">
                  {(index ?? 0) + 1} / {photos.length}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
