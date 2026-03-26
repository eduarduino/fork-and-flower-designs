import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F0EBE3",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          light: "#4A4A4A",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#D4BC8B",
          dark: "#B08D4F",
        },
        blush: {
          DEFAULT: "#E8D5C4",
          light: "#F2E6DA",
        },
        sage: "#A8B5A0",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
