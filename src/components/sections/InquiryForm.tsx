"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  inquirySchema,
  type InquiryFormData,
  eventTypes,
  serviceOptions,
  packageOptions,
  addOnOptions,
} from "@/lib/schemas/inquiry";
import { Button } from "@/components/ui/Button";

/* ── Time slot options (30-min increments) ── */
const timeSlots: string[] = [];
for (let h = 8; h <= 23; h++) {
  for (const m of [0, 30]) {
    if (h === 23 && m === 30) break;
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const period = h >= 12 ? "PM" : "AM";
    const min = m === 0 ? "00" : "30";
    timeSlots.push(`${hour12}:${min} ${period}`);
  }
}

/* ── Phone auto-format helper ── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/* ── Date helpers ── */
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function getDaysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

function getYearOptions(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y <= current + 3; y++) years.push(y);
  return years;
}

/* ── Signature Pad ── */
function SignaturePad({
  onChange,
  error,
}: {
  onChange: (dataUrl: string) => void;
  error?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3A320C";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHasSignature(true);
    onChange(canvas.toDataURL("image/png"));
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange("");
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: TouchEvent) => {
      if (isDrawing.current) e.preventDefault();
    };
    canvas.addEventListener("touchmove", handler, { passive: false });
    return () => canvas.removeEventListener("touchmove", handler);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
          Signature *
        </span>
        {hasSignature && (
          <button
            type="button"
            onClick={clearCanvas}
            className="font-sans text-[10px] tracking-wider text-charcoal-light/60 hover:text-gold transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        className={`w-full h-32 border rounded cursor-crosshair bg-white/50 ${
          error ? "border-red-400" : "border-cream-dark"
        }`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <p className="mt-1 font-sans text-[10px] tracking-wider text-charcoal-light/50">
        Draw your signature above using your mouse or finger
      </p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function InquiryForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    mode: "onChange",
    defaultValues: {
      packages: [],
      addOns: [],
      services: [],
      phone: "",
      signature: "",
    },
  });

  const phoneValue = watch("phone");
  const startTimeValue = watch("startTime");
  const eventTypeValue = watch("eventType");

  // Date dropdowns state
  const [dateMonth, setDateMonth] = useState("");
  const [dateDay, setDateDay] = useState("");
  const [dateYear, setDateYear] = useState("");
  const daysInMonth = getDaysInMonth(parseInt(dateMonth), parseInt(dateYear));

  const syncDate = (m: string, d: string, y: string) => {
    if (m && d && y) {
      const mm = m.padStart(2, "0");
      const dd = d.padStart(2, "0");
      setValue("eventDate", `${y}-${mm}-${dd}`, { shouldValidate: true });
    } else {
      setValue("eventDate", "", { shouldValidate: false });
    }
  };

  const onSubmit = async (data: InquiryFormData) => {
    setSubmitStatus("loading");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      reset();
      setDateMonth("");
      setDateDay("");
      setDateYear("");
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const onInvalid = (formErrors: FieldErrors<InquiryFormData>) => {
    const firstErrorField = Object.keys(formErrors)[0] as
      | keyof InquiryFormData
      | undefined;

    if (!firstErrorField) return;

    const target = document.getElementById(`field-${firstErrorField}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const focusable = target.querySelector<HTMLElement>(
      "input, select, textarea, button, canvas, [tabindex]:not([tabindex='-1'])"
    );
    focusable?.focus?.();
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
    "w-full bg-transparent border-b border-cream-dark focus:border-gold outline-none py-3 font-sans text-base md:text-sm tracking-wider text-charcoal placeholder:text-charcoal-light/50 transition-colors duration-300";

  const selectStyles =
    `${inputStyles} cursor-pointer appearance-none rounded-none pr-5 tracking-normal text-sm md:text-sm`;

  const labelStyles =
    "font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light";

  const sectionTitleStyles =
    "font-serif text-lg md:text-xl text-charcoal tracking-wide mb-6 pb-2 border-b border-cream-dark";

  const textAreaStyles =
    "w-full bg-transparent border-b border-cream-dark focus:border-gold outline-none py-2.5 font-sans text-sm md:text-sm tracking-normal leading-6 text-charcoal placeholder:text-charcoal-light/60 transition-colors duration-300 resize-none overflow-hidden";

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-12">
      {/* ── Contact Information ── */}
      <fieldset>
        <legend className={sectionTitleStyles}>Contact Information</legend>
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div id="field-firstName">
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
            <div id="field-lastName">
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
            <div id="field-phone">
              <label className={labelStyles}>Phone # *</label>
              <input
                type="tel"
                inputMode="numeric"
                className={inputStyles}
                placeholder="(555) 123-4567"
                value={phoneValue}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setValue("phone", formatted, { shouldValidate: true });
                }}
                onBlur={() => {
                  // trigger validation on blur
                  setValue("phone", phoneValue, { shouldValidate: true, shouldTouch: true });
                }}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div id="field-email">
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
            <div id="field-eventDate">
              <label className={labelStyles}>Event Date *</label>
              <input type="hidden" {...register("eventDate")} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative">
                  <select
                    className={`${selectStyles} ${dateMonth ? "text-charcoal" : "text-charcoal-light/50"}`}
                    value={dateMonth}
                    onChange={(e) => {
                      setDateMonth(e.target.value);
                      syncDate(e.target.value, dateDay, dateYear);
                    }}
                  >
                    <option value="" disabled>Month</option>
                    {months.map((name, i) => (
                      <option key={name} value={String(i + 1)}>{name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-light/45">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="relative">
                  <select
                    className={`${selectStyles} ${dateDay ? "text-charcoal" : "text-charcoal-light/50"}`}
                    value={dateDay}
                    onChange={(e) => {
                      setDateDay(e.target.value);
                      syncDate(dateMonth, e.target.value, dateYear);
                    }}
                  >
                    <option value="" disabled>Day</option>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={String(d)}>{d}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-light/45">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="relative">
                  <select
                    className={`${selectStyles} ${dateYear ? "text-charcoal" : "text-charcoal-light/50"}`}
                    value={dateYear}
                    onChange={(e) => {
                      setDateYear(e.target.value);
                      syncDate(dateMonth, dateDay, e.target.value);
                    }}
                  >
                    <option value="" disabled>Year</option>
                    {getYearOptions().map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-light/45">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              {errors.eventDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.eventDate.message}
                </p>
              )}
            </div>
            <div id="field-startTime">
              <label className={labelStyles}>Start Time *</label>
              <div className="relative">
                <select
                  {...register("startTime")}
                  className={`${selectStyles} ${startTimeValue ? "text-charcoal" : "text-charcoal-light/50"}`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-light/45">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              {errors.startTime && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div id="field-eventType">
              <label className={labelStyles}>Type of Event *</label>
              <div className="relative">
                <select
                  {...register("eventType")}
                  className={`${selectStyles} ${eventTypeValue ? "text-charcoal" : "text-charcoal-light/50"}`}
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
                <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-light/45">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              {errors.eventType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.eventType.message}
                </p>
              )}
            </div>
            <div id="field-guestCount">
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
      <fieldset id="field-services">
        <legend className={sectionTitleStyles}>What services are you interested in?</legend>
        <p className="font-sans text-xs tracking-wider text-charcoal-light/70 -mt-4 mb-5">
          Select all that apply.
        </p>
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
          <p className="mt-2 text-xs text-red-500">
            {errors.services.message}
          </p>
        )}
      </fieldset>

      {/* ── Package Selection ── */}
      <fieldset id="field-packages">
        <legend className={sectionTitleStyles}>What packages are you considering?</legend>
        <p className="font-sans text-xs tracking-wider text-charcoal-light/70 -mt-4 mb-5">
          Select all that apply.
        </p>
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
            <textarea
              {...register("colorPalette")}
              className={textAreaStyles}
              rows={2}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              placeholder="e.g., blush & sage, neutrals, bold jewel tones..."
            />
          </div>
          <div>
            <label className={labelStyles}>Theme or Vibe</label>
            <textarea
              {...register("themeOrVibe")}
              className={textAreaStyles}
              rows={2}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              placeholder="e.g., rustic elegance, modern minimalist, garden party..."
            />
          </div>
          <div>
            <label className={labelStyles}>Must-Have Elements</label>
            <textarea
              {...register("mustHaveElements")}
              className={textAreaStyles}
              rows={2}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
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
        <div className="space-y-8">
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

          <div id="field-foodOnIsland">
            <label className="block mb-4 font-sans text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase leading-relaxed text-charcoal-light">
              Will food be displayed on the island? *
            </label>
            <div className="grid max-w-[220px] grid-cols-2 gap-4">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className="relative inline-flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register("foodOnIsland")}
                    className="peer sr-only"
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cream-dark peer-checked:border-gold peer-checked:bg-gold/20 transition-all duration-200 after:content-[''] after:h-2.5 after:w-2.5 after:rounded-full after:bg-gold after:scale-0 peer-checked:after:scale-100 after:transition-transform after:duration-200" />
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
          <label
            id="field-acknowledgeBookingFee"
            className="flex items-start gap-3 cursor-pointer group"
          >
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
              date.{"\u00A0*"}
            </span>
          </label>
          {errors.acknowledgeBookingFee && (
            <p className="ml-7 text-xs text-red-500">
              {errors.acknowledgeBookingFee.message}
            </p>
          )}

          <label
            id="field-acknowledgeAvailability"
            className="flex items-start gap-3 cursor-pointer group"
          >
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
              I understand this form does not guarantee availability.{"\u00A0*"}
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
          <div id="field-printName">
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
          <div id="field-signature">
            <SignaturePad
              onChange={(dataUrl) =>
                setValue("signature", dataUrl, { shouldValidate: true })
              }
              error={errors.signature?.message}
            />
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
          className="w-full transition-opacity duration-300"
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
