export interface Package {
  name: string;
  description: string;
  includes: string[];
  highlighted?: boolean;
}

export interface PackageCategory {
  category: string;
  packages: Package[];
}

export const packageCategories: PackageCategory[] = [
  {
    category: "Tablescape Packages",
    packages: [
      {
        name: "The Petite Table",
        description:
          "A beautifully styled table setting for intimate gatherings.",
        includes: [
          "Styled table for up to 6 guests",
          "Basic floral centerpiece",
          "Candle & linen styling",
          "Setup & breakdown",
        ],
      },
      {
        name: "The Gathered Table",
        description:
          "A fully curated tablescape for mid-sized dinner parties and celebrations.",
        includes: [
          "Styled table for up to 12 guests",
          "Custom floral arrangements",
          "Full place settings with charger plates",
          "Candles, linens & decor accents",
          "Setup & breakdown",
        ],
        highlighted: true,
      },
      {
        name: "The Signature Table",
        description:
          "Our premium tablescape experience with full design customization.",
        includes: [
          "Styled table for 12+ guests",
          "Premium floral artistry",
          "Elevated place settings & styling",
          "Full decor curation & prop styling",
          "Design consultation",
          "Setup & breakdown",
        ],
      },
    ],
  },
  {
    category: "Island & Buffet Packages",
    packages: [
      {
        name: "The Simple Spread",
        description:
          "A clean, styled island or buffet setup for casual gatherings.",
        includes: [
          "Basic island or buffet styling",
          "Simple floral accent",
          "Risers & serving display",
          "Setup & breakdown",
        ],
      },
      {
        name: "The Styled Spread",
        description:
          "A curated island or buffet display with florals and layered decor.",
        includes: [
          "Full island or buffet styling",
          "Custom floral arrangement",
          "Risers, decor & prop styling",
          "Candle accents",
          "Setup & breakdown",
        ],
        highlighted: true,
      },
      {
        name: "The Signature Spread",
        description:
          "Our premium island or buffet experience — fully designed and styled.",
        includes: [
          "Premium island or buffet styling",
          "Premium floral artistry",
          "Full prop & decor curation",
          "Design consultation",
          "Setup & breakdown",
        ],
      },
    ],
  },
];

export const fullHomeExperience: Package = {
  name: "The Full Home Experience",
  description:
    "The ultimate package — combining tablescape and island/buffet styling for a fully designed, cohesive event experience throughout your home.",
  includes: [
    "Full tablescape styling",
    "Full island or buffet styling",
    "Premium floral artistry throughout",
    "Complete prop & decor curation",
    "Design consultation",
    "Setup & breakdown",
  ],
  highlighted: true,
};
