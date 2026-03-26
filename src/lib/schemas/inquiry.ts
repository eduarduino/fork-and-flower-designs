import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  referralSource: z.string().optional(),
  details: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const eventTypes = [
  "Dinner Party",
  "Birthday",
  "Bridal Shower",
  "Baby Shower",
  "Holiday Gathering",
  "Anniversary",
  "Corporate Event",
  "Other",
] as const;

export const serviceOptions = [
  { value: "tablescaping", label: "Tablescaping Styling" },
  { value: "island-buffet", label: "Island & Buffet Styling" },
  { value: "floral-artistry", label: "Floral Artistry" },
  { value: "prop-decor", label: "Prop & Decor Styling" },
  { value: "premium-addons", label: "Premium Add-Ons" },
] as const;
