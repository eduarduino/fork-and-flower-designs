import { z } from "zod";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const inquirySchema = z.object({
  // Contact Info
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .regex(nameRegex, "First name can only contain letters, hyphens, and apostrophes"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .regex(nameRegex, "Last name can only contain letters, hyphens, and apostrophes"),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid 10-digit phone number, e.g. (555) 123-4567"),
  email: z.string().email("Please enter a valid email address"),

  // Event Details
  eventDate: z
    .string()
    .min(1, "Please select an event date")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Event date must be today or in the future"),
  startTime: z.string().min(1, "Please select a start time"),
  eventType: z.string().min(1, "Please select an event type"),
  guestCount: z
    .string()
    .min(1, "Please enter the number of guests")
    .regex(/^\d+$/, "Guest count must be a number")
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 500;
    }, "Guest count must be between 1 and 500"),

  // Services
  services: z.array(z.string()).min(1, "Please select at least one service"),

  // Package Selection
  packages: z.array(z.string()).min(1, "Please select at least one package"),

  // Design Preferences
  colorPalette: z.string().max(200, "Color palette description is too long").optional(),
  themeOrVibe: z.string().max(200, "Theme description is too long").optional(),
  mustHaveElements: z.string().max(500, "Must-have elements description is too long").optional(),

  // Arrangements & Add-ons
  addOns: z.array(z.string()).optional(),
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
    .min(2, "Please print your name")
    .max(100, "Name is too long")
    .regex(nameRegex, "Name can only contain letters, hyphens, and apostrophes"),
  signature: z
    .string()
    .min(1, "Please provide your signature"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

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
