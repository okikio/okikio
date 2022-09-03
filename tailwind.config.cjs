let weights = Array.from(Array(9), (_, i) => (i + 1) * 100);
let fontWeight = {};
weights.forEach((val) => {
  fontWeight[val] = val;
});

module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{md,tsx,jsx,svelte,astro,html}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["Lexend", "Lexend Deca-fallback", "sans-serif"],
        manrope: ["Manrope", "Manrope-fallback", "sans-serif"],

        sans: ["Manrope", "Manrope-fallback", "sans-serif"],
        serif: ["serif"],
      },
      fontWeight,
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
  plugins: [require("@tailwindcss/typography")],
};
