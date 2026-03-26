"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  inquirySchema,
  type InquiryFormData,
  eventTypes,
  serviceOptions,
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
      services: [],
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
          We&apos;ve received your inquiry and will get back to you within 48
          hours. Check your email for a confirmation.
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Name & Email */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Name *
          </label>
          <input
            {...register("name")}
            className={inputStyles}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Email *
          </label>
          <input
            {...register("email")}
            type="email"
            className={inputStyles}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone & Event Type */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Phone
          </label>
          <input
            {...register("phone")}
            type="tel"
            className={inputStyles}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Event Type *
          </label>
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
      </div>

      {/* Date & Guest Count */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Event Date
          </label>
          <input
            {...register("eventDate")}
            type="date"
            className={inputStyles}
          />
        </div>
        <div>
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Estimated Guest Count
          </label>
          <input
            {...register("guestCount")}
            type="number"
            className={inputStyles}
            placeholder="Number of guests"
            min="1"
          />
        </div>
      </div>

      {/* Services */}
      <div>
        <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light block mb-4">
          Services Interested In *
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {serviceOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={option.value}
                {...register("services")}
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
        {errors.services && (
          <p className="mt-2 text-xs text-red-500">{errors.services.message}</p>
        )}
      </div>

      {/* Referral */}
      <div>
        <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
          How Did You Hear About Us?
        </label>
        <input
          {...register("referralSource")}
          className={inputStyles}
          placeholder="Instagram, referral, Google..."
        />
      </div>

      {/* Details */}
      <div>
        <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
          Tell Us About Your Vision
        </label>
        <textarea
          {...register("details")}
          className={`${inputStyles} resize-none`}
          rows={4}
          placeholder="Share any details about your event, color palette, mood, or inspiration..."
        />
      </div>

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
