// Based on [joshwcomeau.com/gatsby/dark-mode/]
const { localStorage, matchMedia } = window;
let getTheme = () => {
    const theme = localStorage.getItem('theme');
    // If the user has explicitly chosen light or dark,
    // let's use it. Otherwise, this value will be null.
    if (typeof theme === 'string') return theme;

    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return null;
};

let setTheme = theme => {
    // If the user has explicitly chosen light or dark, store the default theme
    if (typeof theme === 'string') localStorage.setItem('theme', theme);
};

let mediaTheme = () => {
    // If they haven't been explicitly set, let's check the media query
    const mql = matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
    if (hasMediaQueryPreference) return mql.matches ? 'dark' : 'light';
};

window.setTheme = setTheme;
window.getTheme = getTheme;
window.mediaTheme = mediaTheme;

try {
    let theme = getTheme();
    let html = document.querySelector("html");
    if (theme === null) theme = mediaTheme();
    theme && html.setAttribute("theme", theme);
} catch (e) {
    console.warn("Theming isn't available on this browser.");
}