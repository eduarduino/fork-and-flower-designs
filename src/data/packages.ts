export interface Package {
  name: string;
  description: string;
  includes: string[];
  perfectFor?: string;
  highlighted?: boolean;
}

export interface PackageCategory {
  category: string;
  packages: Package[];
}

export const packageCategories: PackageCategory[] = [
  {
    category: "Tablescape Styling Packages",
    packages: [
      {
        name: "The Petite Table",
        description: "For intimate gatherings and smaller settings.",
        includes: [
          "Styling for up to 4–6 guests",
          "Curated décor pieces",
          "Soft floral arrangement",
          "Candles + layered textures",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Perfect for date nights, birthdays, or cozy dinners at home.",
      },
      {
        name: "The Gathered Table",
        description: "Your table, elevated with thoughtful detail.",
        includes: [
          "Styling for 6–10 guests",
          "Expanded décor selection",
          "Medium floral arrangement",
          "Candles, linens, runners + risers",
          "Coordinated color palette",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Ideal for holidays, brunches, and family celebrations.",
        highlighted: true,
      },
      {
        name: "The Signature Table",
        description: "Your most elevated tablescape experience.",
        includes: [
          "Styling for 10–16 guests",
          "Full curated décor collection",
          "Large floral centerpiece + accent florals",
          "Candles, linens + layered textures",
          "Custom color palette + theme",
          "Specialty décor pieces",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Perfect for milestone events, showers, and beautifully styled dinner parties.",
      },
    ],
  },
  {
    category: "Island & Buffet Styling Packages",
    packages: [
      {
        name: "The Simple Spread",
        description: "Clean, minimal styling for smaller gatherings.",
        includes: [
          "Light décor + candles",
          "Small floral arrangement",
          "Risers + accents",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Great for charcuterie boards, small bites, or dessert displays.",
      },
      {
        name: "The Styled Spread",
        description: "More depth, more texture, more visual impact.",
        includes: [
          "Medium floral arrangement",
          "Candles, risers, trays + accent décor",
          "Coordinated color palette",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Perfect for brunch spreads, grazing tables, or themed gatherings.",
        highlighted: true,
      },
      {
        name: "The Signature Spread",
        description:
          "Your island transformed into a full visual moment.",
        includes: [
          "Large floral arrangement + accent florals",
          "Full décor collection",
          "Candles, risers, trays + layered textures",
          "Custom palette + theme",
          "Specialty décor pieces",
          "Setup + breakdown included",
        ],
        perfectFor:
          "Ideal for larger gatherings, cocktail parties, or events where the island is the star.",
      },
    ],
  },
];

export const fullHomeExperience: Package = {
  name: "The Full Home Experience",
  description:
    "Your table and island styled together for a cohesive, elevated atmosphere.",
  includes: [
    "Choose any tier from each category",
    "Discounted bundle pricing",
    "Seamlessly curated home setup",
  ],
  perfectFor:
    "Perfect for hosts who want their entire space to feel styled and celebration-ready.",
  highlighted: true,
};
