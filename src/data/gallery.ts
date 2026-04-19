import type { StaticImageData } from "next/image";

import img34862 from "../../assets/site-images/designer-gallery-images/34862.jpg";
import img34863 from "../../assets/site-images/designer-gallery-images/34863.jpg";
import img34865 from "../../assets/site-images/designer-gallery-images/34865.jpg";
import img34866 from "../../assets/site-images/designer-gallery-images/34866.jpg";
import img34867 from "../../assets/site-images/designer-gallery-images/34867.jpg";
import img34868 from "../../assets/site-images/designer-gallery-images/34868.jpg";
import img34871 from "../../assets/site-images/designer-gallery-images/34871.jpg";
import img35079 from "../../assets/site-images/designer-gallery-images/35079.jpg";
import img35080 from "../../assets/site-images/designer-gallery-images/35080.jpg";
import img35102 from "../../assets/site-images/designer-gallery-images/35102.jpg";
import img35105 from "../../assets/site-images/designer-gallery-images/35105.jpg";

export type GalleryCategory =
  | "all"
  | "tablescapes"
  | "island-styling"
  | "full-home";

export interface GalleryImage {
  id: string;
  src: StaticImageData;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
  aspect: "portrait" | "landscape" | "square";
}

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tablescapes", label: "Tablescapes" },
  { value: "island-styling", label: "Island Styling" },
  { value: "full-home", label: "Full Home Experience" },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "34862",
    src: img34862,
    alt: "Blush chrysanthemum floral arrangement with greenery",
    category: "tablescapes",
    aspect: "portrait",
  },
  {
    id: "34863",
    src: img34863,
    alt: "Curated buffet spread with sushi, seafood, and candlelight",
    category: "island-styling",
    aspect: "portrait",
  },
  {
    id: "34866",
    src: img34866,
    alt: "Full buffet table styled with florals and evening lighting",
    category: "island-styling",
    aspect: "landscape",
  },
  {
    id: "34865",
    src: img34865,
    alt: "White and blush floral arrangement with lush greenery",
    category: "tablescapes",
    aspect: "portrait",
  },
  {
    id: "35105",
    src: img35105,
    alt: "Grand floral centerpiece with autumn tones and velvet draping",
    category: "tablescapes",
    aspect: "landscape",
  },
  {
    id: "34868",
    src: img34868,
    alt: "Styled bar area with drinks, photos, and neon signage",
    category: "full-home",
    aspect: "portrait",
  },
  {
    id: "35102",
    src: img35102,
    alt: "Elegant food display with carved meats and floral accents",
    category: "island-styling",
    aspect: "landscape",
  },
  {
    id: "34867",
    src: img34867,
    alt: "Kiwi and fruit tower with twisted candles and appetizers",
    category: "island-styling",
    aspect: "portrait",
  },
  {
    id: "34871",
    src: img34871,
    alt: "Neon 'You + Me' sign with personal photos and greenery",
    category: "full-home",
    aspect: "landscape",
  },
  {
    id: "35079",
    src: img35079,
    alt: "Bar cabinet styled with wine, florals, and hexagonal mirror",
    category: "full-home",
    aspect: "landscape",
  },
  {
    id: "35080",
    src: img35080,
    alt: "Close-up of styled bar with bottles and floral arrangements",
    category: "full-home",
    aspect: "landscape",
  },
];
