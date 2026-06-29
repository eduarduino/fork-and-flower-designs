"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  // Portal to <body> so the overlay escapes any ancestor stacking context
  // (e.g. Section's `relative z-10` wrapper). Without this, the modal's
  // `z-[200]` is trapped below the fixed header's root-level `z-50`, which is
  // what pushed the close button behind the navbar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close (desktop) — fixed to the viewport (not the card) so it can
              never be pushed off-screen or behind the fixed header by a tall
              image. Cleared below the navbar via --header-height and layered
              above the overlay content with z-[210]. */}
          <button
            onClick={onClose}
            className="fixed right-6 top-[calc(var(--header-height,8rem)+1rem)] z-[210] hidden rounded-full bg-charcoal/60 p-2 text-cream transition-colors hover:bg-charcoal/80 md:block"
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

            {/* Close (mobile) — anchored to the image card, unchanged from the
                original mobile experience. Hidden on desktop, where the
                viewport-fixed button above takes over. */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 z-10 rounded-full bg-charcoal/60 p-2 text-cream transition-colors hover:bg-charcoal/80 md:hidden"
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
    </AnimatePresence>,
    document.body,
  );
}
