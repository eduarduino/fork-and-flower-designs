import { z } from "zod";

export const inquirySchema = z.object({
  // Contact Info
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),

  // Event Details
  eventDate: z.string().min(1, "Please select an event date"),
  startTime: z.string().min(1, "Please enter a start time"),
  eventType: z.string().min(1, "Please select an event type"),
  guestCount: z.string().min(1, "Please enter the number of guests"),

  // Services
  serviceType: z.enum(["tablescape", "island-buffet", "both"], {
    required_error: "Please select a service type",
  }),

  // Package Selection
  packages: z.array(z.string()).min(1, "Please select at least one package"),

  // Design Preferences
  colorPalette: z.string().optional(),
  themeOrVibe: z.string().optional(),
  mustHaveElements: z.string().optional(),

  // Arrangements & Add-ons
  addOns: z.array(z.string()).optional(),
  foodOnIsland: z.enum(["yes", "no"], {
    required_error: "Please select an option",
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
  printName: z.string().min(2, "Please print your name"),
  signature: z.string().min(2, "Please provide your signature"),
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

export const serviceTypes = [
  { value: "tablescape", label: "Tablescape Styling" },
  { value: "island-buffet", label: "Island / Buffet Styling" },
  { value: "both", label: "Both" },
] as const;

export const packageOptions = [
  { value: "petite-table", label: "The Petite Table" },
  { value: "gathered-table", label: "The Gathered Table" },
  { value: "signature-table", label: "The Signature Table" },
  { value: "simple-spread", label: "The Simple Spread" },
  { value: "styled-spread", label: "The Styled Spread" },
  { value: "signature-spread", label: "The Signature Spread" },
] as const;

export const addOnOptions = [
  { value: "bartenders", label: "Bartenders" },
  { value: "servers", label: "Servers" },
  { value: "chef", label: "Private Chef" },
  { value: "bar-cart", label: "Bar Cart Setup" },
  { value: "extra-florals", label: "Extra Florals" },
  { value: "dessert-champagne", label: "Dessert / Champagne Station" },
] as const;
