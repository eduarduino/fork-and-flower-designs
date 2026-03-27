"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  inquirySchema,
  type InquiryFormData,
  eventTypes,
  serviceTypes,
  packageOptions,
  addOnOptions,
} from "@/lib/schemas/inquiry";
import { Button } from "@/components/ui/Button";

export function InquiryForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      packages: [],
      addOns: [],
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setSubmitStatus("loading");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-serif text-2xl text-gold">✦</span>
        <h3 className="mt-4 font-serif text-2xl md:text-3xl text-charcoal tracking-wide">
          Thank You!
        </h3>
        <p className="mt-4 font-sans text-sm text-charcoal-light tracking-wider">
          We&apos;ve received your event inquiry and will get back to you within
          48 hours. Check your email for a confirmation.
        </p>
        <div className="mt-8">
          <Button onClick={() => setSubmitStatus("idle")} variant="outline">
            Submit Another Inquiry
          </Button>
        </div>
      </motion.div>
    );
  }

  const inputStyles =
    "w-full bg-transparent border-b border-cream-dark focus:border-gold outline-none py-3 font-sans text-sm tracking-wider text-charcoal placeholder:text-charcoal-light/50 transition-colors duration-300";

  const labelStyles =
    "font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light";

  const sectionTitleStyles =
    "font-serif text-lg md:text-xl text-charcoal tracking-wide mb-6 pb-2 border-b border-cream-dark";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* ── Contact Information ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Contact Information</legend>
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className={labelStyles}>First Name *</label>
              <input
                {...register("firstName")}
                className={inputStyles}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Last Name *</label>
              <input
                {...register("lastName")}
                className={inputStyles}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className={labelStyles}>Phone # *</label>
              <input
                {...register("phone")}
                type="tel"
                className={inputStyles}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Email *</label>
              <input
                {...register("email")}
                type="email"
                className={inputStyles}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Event Details ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Event Details</legend>
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className={labelStyles}>Event Date *</label>
              <input
                {...register("eventDate")}
                type="date"
                className={inputStyles}
              />
              {errors.eventDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.eventDate.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Start Time *</label>
              <input
                {...register("startTime")}
                type="time"
                className={inputStyles}
              />
              {errors.startTime && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className={labelStyles}>Type of Event *</label>
              <select
                {...register("eventType")}
                className={`${inputStyles} cursor-pointer`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select event type
                </option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.eventType.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyles}># of Guests *</label>
              <input
                {...register("guestCount")}
                type="number"
                className={inputStyles}
                placeholder="Number of guests"
                min="1"
              />
              {errors.guestCount && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.guestCount.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Services ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Services</legend>
        <div className="space-y-3">
          {serviceTypes.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                value={option.value}
                {...register("serviceType")}
                className="peer sr-only"
              />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cream-dark peer-checked:border-gold transition-all duration-200">
                <span className="h-2 w-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity" />
              </span>
              <span className="font-sans text-xs tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.serviceType && (
          <p className="mt-2 text-xs text-red-500">
            {errors.serviceType.message}
          </p>
        )}
      </fieldset>

      {/* ── Package Selection ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Package Selection</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {packageOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={option.value}
                {...register("packages")}
                className="peer sr-only"
              />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-cream-dark peer-checked:border-gold peer-checked:bg-gold transition-all duration-200">
                <svg
                  className="h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <span className="font-sans text-xs tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.packages && (
          <p className="mt-2 text-xs text-red-500">
            {errors.packages.message}
          </p>
        )}
      </fieldset>

      {/* ── Design Preferences ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Design Preferences</legend>
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>Color Palette</label>
            <input
              {...register("colorPalette")}
              className={inputStyles}
              placeholder="e.g., blush & sage, neutrals, bold jewel tones..."
            />
          </div>
          <div>
            <label className={labelStyles}>Theme or Vibe</label>
            <input
              {...register("themeOrVibe")}
              className={inputStyles}
              placeholder="e.g., rustic elegance, modern minimalist, garden party..."
            />
          </div>
          <div>
            <label className={labelStyles}>Must-Have Elements</label>
            <textarea
              {...register("mustHaveElements")}
              className={`${inputStyles} resize-none`}
              rows={3}
              placeholder="Candles, specific flowers, charger plates, table runners..."
            />
          </div>
        </div>
      </fieldset>

      {/* ── Arrangements & Add-Ons ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>
          Arrangements &amp; Add-Ons
        </legend>
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {addOnOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register("addOns")}
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-cream-dark peer-checked:border-gold peer-checked:bg-gold transition-all duration-200">
                  <svg
                    className="h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span className="font-sans text-xs tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          <div>
            <label className={`${labelStyles} block mb-3`}>
              Will food be displayed on the island? *
            </label>
            <div className="flex gap-6">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register("foodOnIsland")}
                    className="peer sr-only"
                  />
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cream-dark peer-checked:border-gold transition-all duration-200">
                    <span className="h-2 w-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </span>
                  <span className="font-sans text-xs tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors capitalize">
                    {val}
                  </span>
                </label>
              ))}
            </div>
            {errors.foodOnIsland && (
              <p className="mt-1 text-xs text-red-500">
                {errors.foodOnIsland.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Acknowledgements ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Acknowledgements</legend>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("acknowledgeBookingFee")}
              className="peer sr-only"
            />
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-cream-dark peer-checked:border-gold peer-checked:bg-gold transition-all duration-200">
              <svg
                className="h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className="font-sans text-xs leading-relaxed tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors">
              I understand a non-refundable booking fee is required to secure my
              date. *
            </span>
          </label>
          {errors.acknowledgeBookingFee && (
            <p className="ml-7 text-xs text-red-500">
              {errors.acknowledgeBookingFee.message}
            </p>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("acknowledgeAvailability")}
              className="peer sr-only"
            />
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-cream-dark peer-checked:border-gold peer-checked:bg-gold transition-all duration-200">
              <svg
                className="h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className="font-sans text-xs leading-relaxed tracking-wider text-charcoal-light group-hover:text-charcoal transition-colors">
              I understand this form does not guarantee availability. *
            </span>
          </label>
          {errors.acknowledgeAvailability && (
            <p className="ml-7 text-xs text-red-500">
              {errors.acknowledgeAvailability.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* ── Signature ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Signature</legend>
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>Print Name *</label>
            <input
              {...register("printName")}
              className={inputStyles}
              placeholder="Your full name"
            />
            {errors.printName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.printName.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelStyles}>Signature *</label>
            <input
              {...register("signature")}
              className={`${inputStyles} font-serif italic text-lg`}
              placeholder="Type your signature"
            />
            {errors.signature && (
              <p className="mt-1 text-xs text-red-500">
                {errors.signature.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Error Message */}
      {submitStatus === "error" && (
        <p className="text-center text-sm text-red-500">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitStatus === "loading"}
        >
          {submitStatus === "loading" ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Sending...
            </span>
          ) : (
            "Submit Inquiry"
          )}
        </Button>
      </div>
    </form>
  );
}
