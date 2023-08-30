import Typography from "@tailwindcss/typography";

/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "media",
  content: ["./src/**/*.{md,tsx,jsx,svelte,astro,html}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["Lexend Deca Variable", "Lexend Deca-fallback", "sans-serif"],
        manrope: ["Manrope Variable", "Manrope-fallback", "sans-serif"],

        sans: ["Manrope Variable", "Manrope-fallback", "sans-serif"],
        serif: ["serif"],
      },
      screens: {
        "3xl": "1633px",
        "1.5xl": "1333px",

        "lt-2xl": { max: "1535px" },
        "lt-xl": { max: "1279px" },
        "lt-lg": { max: "1023px" },
        "lt-md": { max: "767px" },
        "lt-sm": { max: "639px" },

        "xsm": "439px",
        "lt-xsm": { max: "439px" },

        "xxsm": "339px",
        "lt-xxsm": { max: "339px" },

        'coarse': { 'raw': '(pointer: coarse)' },
        'fine': { 'raw': '(pointer: fine)' },
      },
      container: {
        center: "true",
      },
      colors: {
        primary: "#ffff00"
      }
    },
  },
  plugins: [
    Typography({ target: "modern" })
  ],
};
