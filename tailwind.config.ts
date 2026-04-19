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
          DEFAULT: "#FFFFFF",
          dark: "#EBDED4",
        },
        charcoal: {
          DEFAULT: "#3A320C",
          light: "#5C5230",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#D4BC8B",
          dark: "#B08D4F",
        },
        blush: {
          DEFAULT: "#EBDED4",
          light: "#F3EBE4",
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
