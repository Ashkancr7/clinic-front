import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Vazirmatn", "IRANSansX", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0EA5A4",
          light: "#5EEAD4",
          dark: "#0F766E",
        },
        secondary: {
          pink: "#FBCFE8",
          purple: "#DDD6FE",
          blue: "#BFDBFE",
        },
        danger: "#F87171",
        success: "#4ADE80",
        warning: "#FBBF24",
      },
    },
  },
  plugins: [],
};

export default config;
