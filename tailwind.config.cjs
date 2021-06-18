let weights = Array.from(Array(9), (_, i) => (i + 1) * 100);
let fontWeight = {};
weights.forEach((val) => {
    fontWeight[val] = val;
});

module.exports = {
    darkMode: "class",
    mode: "jit",
    purge: ["src/**/*.pug"],
    theme: {
        extend: {
            fontFamily: {
                manrope: ["Manrope", "Century Gothic", "sans-serif"],
                montserrat: ["Montserrat", "Century Gothic", "sans-serif"],
            },
            spacing: {
                300: "300px",
                400: "400px",
                450: "450px",
                500: "500px",
            },
            minHeight: (theme) => theme("spacing"),
            minWidth: (theme) => theme("spacing"),
            fontWeight,
            colors: {
                elevated: "#1C1C1E",
                "elevated-2": "#262628",
                label: "#ddd",
                secondary: "#bbb",
                tertiary: "#555",
                quaternary: "#333",
                "center-container-dark": "#121212",

                primary: "#ffff00",
                // secondary: "#FFC5C5",
                // vibrant: "#FFE600",
            },
            screens: {
                "3xl": "1633px",
                "1.5xl": "1333px",
                "lt-2xl": { max: "1535px" },

                "lt-xl": { max: "1279px" },

                "lt-lg": { max: "1023px" },

                "lt-md": { max: "767px" },

                "lt-sm": { max: "639px" },

                "lt-xsm": { max: "339px" },
            },
            container: {
                center: "true",
            },
        },
    },
    /* ... */
};
