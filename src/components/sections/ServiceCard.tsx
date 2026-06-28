"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { usePhotoTap } from "@/hooks/usePhotoTap";
import type { Service } from "@/data/services";

interface ServicePreviewCardProps {
  service: Service;
  index: number;
  onOpen?: () => void;
}

export function ServicePreviewCard({
  service,
  index,
  onOpen,
}: ServicePreviewCardProps) {
  const tapHandlers = usePhotoTap(() => onOpen?.());
  const isClickable = Boolean(service.image && onOpen);

  return (
    <AnimateIn delay={index * 0.1}>
      <div className="group">
        <div
          className={`relative aspect-[4/5] overflow-hidden bg-cream-dark ${
            isClickable ? "cursor-pointer" : ""
          }`}
          {...(isClickable
            ? {
                onPointerDown: tapHandlers.onPointerDown,
                onPointerMove: tapHandlers.onPointerMove,
                onClick: tapHandlers.onClick,
              }
            : {})}
        >
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
  onOpen?: () => void;
}

export function ServiceDetailCard({
  service,
  index,
  reversed = false,
  onOpen,
}: ServiceDetailCardProps) {
  const tapHandlers = usePhotoTap(() => onOpen?.());
  const isClickable = Boolean(service.image && onOpen);

  return (
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
            isClickable ? "cursor-pointer group" : ""
          }`}
          {...(isClickable
            ? {
                onPointerDown: tapHandlers.onPointerDown,
                onPointerMove: tapHandlers.onPointerMove,
                onClick: tapHandlers.onClick,
              }
            : {})}
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
  );
}

/* ─────────────── Home preview grid (3 photos, shared lightbox) ─────────────── */

export function HomeServicesPreview({ services }: { services: Service[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photoServices = services.filter((s) => s.image);
  const photos = photoServices.map((s) => ({ src: s.image!, alt: s.title }));

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <ServicePreviewCard
            key={service.id}
            service={service}
            index={i}
            onOpen={() => setLightboxIndex(photoServices.indexOf(service))}
          />
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}

/* ─────────────── Services page sections (5 photos, shared lightbox) ─────────────── */

export function ServicesDetailSection({ services }: { services: Service[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photoServices = services.filter((s) => s.image);
  const photos = photoServices.map((s) => ({ src: s.image!, alt: s.title }));

  return (
    <>
      <div className="space-y-20 md:space-y-28">
        {services.map((service, i) => (
          <ServiceDetailCard
            key={service.id}
            service={service}
            index={i}
            reversed={i % 2 !== 0}
            onOpen={() => setLightboxIndex(photoServices.indexOf(service))}
          />
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
