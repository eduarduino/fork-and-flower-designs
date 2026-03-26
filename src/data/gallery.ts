export type GalleryCategory =
  | "all"
  | "tablescaping"
  | "island-buffet"
  | "floral"
  | "decor";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
  aspect: "portrait" | "landscape" | "square";
}

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tablescaping", label: "Tablescaping" },
  { value: "island-buffet", label: "Island & Buffet" },
  { value: "floral", label: "Floral" },
  { value: "decor", label: "Decor" },
];

// Placeholder gallery images — replace with real portfolio photos
export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/images/gallery/table-1.jpg",
    alt: "Elegant dinner table with layered textures and candlelight",
    category: "tablescaping",
    aspect: "landscape",
  },
  {
    id: "2",
    src: "/images/gallery/table-2.jpg",
    alt: "Intimate tablescape with floral centerpiece",
    category: "tablescaping",
    aspect: "portrait",
  },
  {
    id: "3",
    src: "/images/gallery/island-1.jpg",
    alt: "Kitchen island styled with charcuterie and florals",
    category: "island-buffet",
    aspect: "landscape",
  },
  {
    id: "4",
    src: "/images/gallery/floral-1.jpg",
    alt: "Custom floral arrangement in neutral tones",
    category: "floral",
    aspect: "square",
  },
  {
    id: "5",
    src: "/images/gallery/floral-2.jpg",
    alt: "Romantic blush and white floral centerpiece",
    category: "floral",
    aspect: "portrait",
  },
  {
    id: "6",
    src: "/images/gallery/decor-1.jpg",
    alt: "Curated decor pieces with candles and linens",
    category: "decor",
    aspect: "landscape",
  },
  {
    id: "7",
    src: "/images/gallery/table-3.jpg",
    alt: "Outdoor garden dinner tablescape",
    category: "tablescaping",
    aspect: "landscape",
  },
  {
    id: "8",
    src: "/images/gallery/island-2.jpg",
    alt: "Buffet display with elevated serving pieces",
    category: "island-buffet",
    aspect: "square",
  },
  {
    id: "9",
    src: "/images/gallery/decor-2.jpg",
    alt: "Styled vignette with vintage props",
    category: "decor",
    aspect: "portrait",
  },
  {
    id: "10",
    src: "/images/gallery/floral-3.jpg",
    alt: "Seasonal autumn floral arrangement",
    category: "floral",
    aspect: "landscape",
  },
  {
    id: "11",
    src: "/images/gallery/table-4.jpg",
    alt: "Minimalist modern tablescape",
    category: "tablescaping",
    aspect: "square",
  },
  {
    id: "12",
    src: "/images/gallery/decor-3.jpg",
    alt: "Luxe candle and linen styling details",
    category: "decor",
    aspect: "landscape",
  },
];
