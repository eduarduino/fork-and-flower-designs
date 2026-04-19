"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { Service } from "@/data/services";

interface ServicePreviewCardProps {
  service: Service;
  index: number;
}

export function ServicePreviewCard({ service, index }: ServicePreviewCardProps) {
  return (
    <AnimateIn delay={index * 0.1}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-lg text-charcoal-light/30 italic">
                {service.title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
        </div>

        <div className="mt-5">
          <h3 className="font-serif text-xl tracking-wide text-charcoal">
            {service.title}
          </h3>
          <p className="mt-2 font-sans text-xs leading-relaxed text-charcoal-light tracking-wider">
            {service.description}
          </p>
        </div>
      </div>
    </AnimateIn>
  );
}

interface ServiceDetailCardProps {
  service: Service;
  index: number;
  reversed?: boolean;
}

export function ServiceDetailCard({
  service,
  index,
  reversed = false,
}: ServiceDetailCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [lightboxOpen]);

  return (
    <>
      <div
        className={`flex flex-col gap-8 md:gap-14 ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        } items-center`}
      >
        <AnimateIn
          className="w-full md:w-1/2"
          direction={reversed ? "right" : "left"}
          delay={index * 0.1}
        >
          <div
            className={`relative aspect-[4/3] overflow-hidden bg-cream-dark ${
              service.image ? "cursor-pointer group" : ""
            }`}
            onClick={() => service.image && setLightboxOpen(true)}
          >
            {service.image ? (
              <>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
                <div className="absolute bottom-3 right-3 rounded-full bg-charcoal/40 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-cream"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-lg text-charcoal-light/30 italic">
                  {service.title}
                </span>
              </div>
            )}
          </div>
        </AnimateIn>

        <AnimateIn
          className="w-full md:w-1/2"
          direction={reversed ? "left" : "right"}
          delay={index * 0.1 + 0.1}
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
            0{index + 1}
          </span>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-wide text-charcoal font-light">
            {service.title}
          </h3>
          <div className="mt-3 h-px w-10 bg-gold" />
          <p className="mt-5 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
            {service.description}
          </p>
        </AnimateIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && service.image && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
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
                src={service.image}
                alt={service.title}
                width={service.image.width}
                height={service.image.height}
                sizes="(max-width: 1024px) 90vw, 896px"
                className="h-auto max-h-[85vh] w-auto mx-auto object-contain"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-2 -right-2 md:top-2 md:right-2 bg-charcoal/60 hover:bg-charcoal/80 text-cream rounded-full p-2 transition-colors"
                aria-label="Close"
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
