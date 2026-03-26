export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const services: Service[] = [
  {
    id: "tablescaping",
    title: "Tablescaping Styling",
    description:
      "Curated table designs using layered textures, candles, florals, and decor that transform your dining space into an elevated, intimate experience.",
    image: "/images/services/tablescaping.jpg",
  },
  {
    id: "island-buffet",
    title: "Island & Buffet Styling",
    description:
      "Floral-forward decor and aesthetic arrangements that turn your kitchen island or buffet into a beautiful focal point for food, drinks, and gathering.",
    image: "/images/services/island-buffet.jpg",
  },
  {
    id: "floral-artistry",
    title: "Floral Artistry",
    description:
      "Custom floral arrangements designed to complement your event's mood and palette. Always styled with intention.",
    image: "/images/services/floral-artistry.jpg",
  },
  {
    id: "prop-decor",
    title: "Prop & Decor Styling",
    description:
      "A curated collection of decor pieces, risers, vases, candles, linens, and styling elements brought directly to your home. Everything is thoughtfully chosen, arranged, and styled to create a cohesive, elevated atmosphere.",
    image: "/images/services/prop-decor.jpg",
  },
  {
    id: "premium-addons",
    title: "Premium Add-Ons",
    description:
      "Bartenders, servers, private chefs, bar cart rental and set-up, themed pieces, extra decor, specialty props, and custom menus to complete your experience.",
    image: "/images/services/premium-addons.jpg",
  },
];
