export interface Package {
  name: string;
  startingAt: string;
  description: string;
  includes: string[];
  highlighted?: boolean;
}

export const packages: Package[] = [
  {
    name: "The Gathering",
    startingAt: "Contact for pricing",
    description: "Perfect for intimate dinner parties and small celebrations.",
    includes: [
      "Tablescaping for up to 8 guests",
      "Basic floral arrangement",
      "Candle & linen styling",
      "Setup & breakdown",
      "1-hour styling consultation",
    ],
  },
  {
    name: "The Celebration",
    startingAt: "Contact for pricing",
    description:
      "Our most popular package for those who want a fully styled experience.",
    includes: [
      "Tablescaping for up to 16 guests",
      "Custom floral arrangements",
      "Island or buffet styling",
      "Full prop & decor curation",
      "Setup & breakdown",
      "2-hour styling consultation",
    ],
    highlighted: true,
  },
  {
    name: "The Grand Affair",
    startingAt: "Contact for pricing",
    description:
      "The ultimate luxury experience for larger events and special occasions.",
    includes: [
      "Tablescaping for 16+ guests",
      "Premium floral artistry",
      "Island & buffet styling",
      "Full prop & decor curation",
      "Premium add-ons included",
      "Setup & breakdown",
      "Full-day styling consultation",
    ],
  },
];
