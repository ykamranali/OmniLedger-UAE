import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfd",
          300: "#7cc2fb",
          400: "#36a2f7",
          500: "#0c85eb",
          600: "#0267c7",
          700: "#0352a1",
          800: "#074684",
          900: "#0c3b6e",
          950: "#082549",
        },
        navy: {
          800: "#0f172a",
          900: "#0b1329",
          950: "#070c1e",
        },
        uae: {
          emerald: "#00966e",
          red: "#d32f2f",
          gold: "#c59b27",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
