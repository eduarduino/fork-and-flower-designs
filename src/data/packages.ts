export interface Package {
  name: string;
  description: string;
  includes: string[];
  detailedDescription?: string;
  perfectFor?: string;
  highlighted?: boolean;
}

export interface PackageCategory {
  category: string;
  packages: Package[];
}

export interface AddOn {
  name: string;
  description: string;
}

export const packageCategories: PackageCategory[] = [
  {
    category: "Tablescape Styling Packages",
    packages: [
      {
        name: "The Petite Table",
        description: "For intimate gatherings and smaller settings.",
        detailedDescription:
          "A softly styled tablescape featuring curated décor, candles, and a delicate floral arrangement. Designed for cozy dinners, birthdays, or small celebrations where you want the table to feel special without being overdone.",
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
        detailedDescription:
          "A fuller, more layered tablescape with expanded décor, medium floral arrangements, linens, runners, and thoughtful textures. The kind of table that becomes the heart of the home — where every detail feels intentional and every seat feels considered.",
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
        detailedDescription:
          "A full décor collection, large floral centerpiece with accent florals, candles, linens, textures, and a custom palette or theme. Every element is hand-selected and styled to create an unforgettable setting for milestone moments, showers, and beautifully styled dinner parties.",
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
        detailedDescription:
          "A clean, minimal island or buffet setup with light décor, candles, and a small floral arrangement. Everything you need to elevate your spread without overwhelming the space — letting the food and the moment take center stage.",
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
        detailedDescription:
          "A more detailed island design featuring medium florals, risers, trays, candles, and coordinated décor. Layered with intention to give your spread a curated, magazine-worthy look that feels as good as the food tastes.",
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
        detailedDescription:
          "A full transformation of your island or buffet into a visual focal point. Large florals, full décor collection, layered textures, candles, risers, trays, linens, and a custom palette or theme. For events where the island is the star of the show.",
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
  detailedDescription:
    "Choose any tier from each category and enjoy a seamless, beautifully curated home setup. Every surface, every detail, every moment — designed to flow together so your entire space feels styled and celebration-ready.",
  includes: [
    "Choose any tier from each category",
    "Discounted bundle pricing",
    "Seamlessly curated home setup",
  ],
  perfectFor:
    "Perfect for hosts who want their entire space to feel styled and celebration-ready.",
  highlighted: true,
};

export const premiumAddOns: AddOn[] = [
  {
    name: "Bartenders",
    description:
      "Professional bartenders for cocktail hours, dinner parties, and intimate celebrations.",
  },
  {
    name: "Servers",
    description:
      "Attentive service staff to help with plating, passing, and maintaining a smooth flow throughout the event.",
  },
  {
    name: "Private Chef",
    description:
      "Partnered chefs who prepare in-home meals, tasting menus, or themed dining experiences.",
  },
  {
    name: "Bar Cart Setup",
    description:
      "A styled bar cart complete with glassware, décor, and floral accents — perfect for self-serve cocktails or champagne moments.",
  },
  {
    name: "Extra Florals",
    description:
      "Additional floral arrangements to extend the styling beyond the table or island.",
  },
  {
    name: "Dessert & Champagne Station",
    description:
      "A styled dessert display or champagne station — the perfect finishing touch for any celebration.",
  },
];
