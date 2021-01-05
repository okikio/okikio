// Based on [joshwcomeau.com/gatsby/dark-mode/]
export let getTheme = (): string | null => {
    let theme = window.localStorage.getItem("theme");
    // If the user has explicitly chosen light or dark,
    // let's use it. Otherwise, this value will be null.
    if (typeof theme === "string") return theme;

    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return null;
};

export let setTheme = (theme: string): void => {
    // If the user has explicitly chosen light or dark, store the default theme
    if (typeof theme === "string") window.localStorage.setItem("theme", theme);
};

export let mediaTheme = (): string | null => {
    // If they haven't been explicitly set, let's check the media query
    let { matches } = window.matchMedia("(prefers-color-scheme: dark)");
    let hasMediaQueryPreference = typeof matches === "boolean";
    if (hasMediaQueryPreference) return matches ? "dark" : "light";
    return null;
};

// Get theme from html tag, if it has a theme or get it from localStorage
let html = document.querySelector("html");
export let themeGet = () => {
    let themeAttr = html.getAttribute("data-theme");
    if (typeof themeAttr === "string" && themeAttr.length) return themeAttr;
    return getTheme();
};

// Set theme in localStorage, as well as in the html tag
export let themeSet = (theme: string) => {
    html.setAttribute("data-theme", theme);
    setTheme(theme);
};

try {
    let theme = getTheme();
    if (theme === null) theme = mediaTheme();
    theme && themeSet(theme);

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", ({ matches }) => themeSet(matches ? "dark" : "light"));

    window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", ({ matches }) => themeSet(matches ? "light" : "dark"));

    let handler = () => {
        // On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
        let themeSwitch = document.querySelector(".theme-switch");
        themeSwitch
            ?.addEventListener("click", () => themeSet(themeGet() === "dark" ? "light" : "dark"));

        document.removeEventListener("DOMContentLoaded", handler);
        window.removeEventListener("load", handler);
    };

    document.addEventListener("DOMContentLoaded", handler);
    window.addEventListener("load", handler);
} catch (e) {
    console.warn("Theming isn't available on this browser.", e);
}
