import { z } from "zod";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const eventTypes = [
  "Birthday",
  "Dinner Party",
  "Shower",
  "Holiday",
  "Anniversary",
  "Corporate Event",
  "Other",
] as const;

export const serviceOptions = [
  { value: "tablescape", label: "Tablescape Styling" },
  { value: "island-buffet", label: "Island / Buffet Styling" },
] as const;

export const packageOptions = [
  { value: "petite-table", label: "The Petite Table" },
  { value: "gathered-table", label: "The Gathered Table" },
  { value: "signature-table", label: "The Signature Table" },
  { value: "simple-spread", label: "The Simple Spread" },
  { value: "styled-spread", label: "The Styled Spread" },
  { value: "signature-spread", label: "The Signature Spread" },
  { value: "full-home-experience", label: "The Full Home Experience" },
] as const;

export const addOnOptions = [
  { value: "bartenders", label: "Bartenders" },
  { value: "servers", label: "Servers" },
  { value: "chef", label: "Private Chef" },
  { value: "bar-cart", label: "Bar Cart Setup" },
  { value: "extra-florals", label: "Extra Florals" },
  { value: "dessert-champagne", label: "Dessert / Champagne Station" },
] as const;

const serviceValues = serviceOptions.map((s) => s.value) as [string, ...string[]];
const packageValues = packageOptions.map((p) => p.value) as [string, ...string[]];
const addOnValues = addOnOptions.map((a) => a.value) as [string, ...string[]];

// Signature: we accept either a drawn PNG (data URL) or a typed name fallback.
// Strict prefix guard prevents arbitrary `javascript:` / `data:text/html` URIs
// from ever reaching the owner email template.
const SIGNATURE_DATAURL_PREFIX = "data:image/png;base64,";
const MAX_SIGNATURE_DATAURL_LEN = 600_000; // ~450 KB decoded — comfortably fits a 600×160 PNG
const MAX_SIGNATURE_TEXT_LEN = 100;

const signatureSchema = z
  .string()
  .min(1, "Please provide your signature")
  .max(MAX_SIGNATURE_DATAURL_LEN, "Signature is too large")
  .refine(
    (val) => {
      if (val.startsWith(SIGNATURE_DATAURL_PREFIX)) {
        // base64 body only
        const body = val.slice(SIGNATURE_DATAURL_PREFIX.length);
        return /^[A-Za-z0-9+/=]+$/.test(body) && body.length > 0;
      }
      // Plain-text fallback: must look like a printed name
      return (
        val.length <= MAX_SIGNATURE_TEXT_LEN && nameRegex.test(val)
      );
    },
    "Signature must be a drawn image or a printed name"
  );

export const inquirySchema = z.object({
  // Contact Info
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .regex(nameRegex, "First name can only contain letters, hyphens, and apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .regex(nameRegex, "Last name can only contain letters, hyphens, and apostrophes"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit phone number, e.g. (555) 123-4567"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),

  // Event Details
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select an event date")
    .refine((val) => {
      const [y, m, d] = val.split("-").map(Number);
      const selected = new Date(y, m - 1, d);
      if (Number.isNaN(selected.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Event date must be today or in the future"),
  startTime: z
    .string()
    .trim()
    .min(1, "Please select a start time")
    .max(16, "Invalid start time")
    .regex(/^\d{1,2}:\d{2}\s(AM|PM)$/, "Invalid start time"),
  eventType: z.enum(eventTypes, {
    errorMap: () => ({ message: "Please select an event type" }),
  }),
  guestCount: z
    .string()
    .regex(/^\d{1,4}$/, "Guest count must be a number")
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 500;
    }, "Guest count must be between 1 and 500"),

  // Services
  services: z
    .array(z.enum(serviceValues))
    .min(1, "Please select at least one service")
    .max(serviceValues.length, "Too many services selected"),

  // Package Selection
  packages: z
    .array(z.enum(packageValues))
    .min(1, "Please select at least one package")
    .max(packageValues.length, "Too many packages selected"),

  // Design Preferences
  colorPalette: z
    .string()
    .trim()
    .max(200, "Color palette description is too long")
    .optional(),
  themeOrVibe: z
    .string()
    .trim()
    .max(200, "Theme description is too long")
    .optional(),
  mustHaveElements: z
    .string()
    .trim()
    .max(500, "Must-have elements description is too long")
    .optional(),

  // Arrangements & Add-ons
  addOns: z
    .array(z.enum(addOnValues))
    .max(addOnValues.length, "Too many add-ons selected")
    .optional(),
  foodOnIsland: z.enum(["yes", "no"], {
    required_error: "Please select yes or no",
    invalid_type_error: "Please select yes or no",
  }),

  // Required Acknowledgements
  acknowledgeBookingFee: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge the booking fee policy" }),
  }),
  acknowledgeAvailability: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge the availability disclaimer",
    }),
  }),

  // Signature
  printName: z
    .string()
    .trim()
    .min(2, "Please print your name")
    .max(100, "Name is too long")
    .regex(nameRegex, "Name can only contain letters, hyphens, and apostrophes"),
  signature: signatureSchema,

  // Spam trap — must be empty. Real browsers leave it blank; bots often fill it.
  website: z
    .string()
    .max(0, "Invalid submission")
    .optional()
    .or(z.literal("")),

  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
