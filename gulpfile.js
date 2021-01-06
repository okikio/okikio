const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
const {
    stream,
    task,
    watch,
    parallel,
    series,
    tasks,
    parallelFn,
} = require("./util");

const dotenv =
    "netlify" in process.env || "dev" in process.env
        ? process.env
        : require("dotenv");
if (typeof dotenv.config === "function") dotenv.config();

const env = process.env;
const dev = "dev" in env ? env.dev == "true" : false;
const netlify = "netlify" in env ? env.netlify == "true" : false;

// Origin folders (source and destination folders)
const srcFolder = `build`;
const destFolder = `docs`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const pugFolder = `${srcFolder}/pug`;
const srcCSSFolder = `${srcFolder}/css`;
const assetsFolder = `${srcFolder}/assets`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const destCSSFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// Main ts file bane
const tsFile = `main.ts`;

// HTML Tasks
const dataPath = `./data.js`;
const iconPath = `./icons.js`;

const resolve = require.resolve(dataPath);
const iconResolve = require.resolve(iconPath);

const pugConfig = {
    pretty: false,
    basedir: pugFolder,
    self: true,
};

task("html", async () => {
    const [
        { default: plumber },
        { default: pug },
        { default: minifyJSON },
    ] = await Promise.all([
        import("gulp-plumber"),
        import("gulp-pug"),
        import("gulp-minify-inline-json"),
    ]);

    let data = require(resolve);
    let icons = require(iconResolve);
    return stream(`${pugFolder}/pages/**/*.pug`, {
        pipes: [
            plumber(), // Recover from errors without cancelling build task
            // Compile src html using Pug
            pug({
                ...pugConfig,
                data: { ...data, icons, netlify },
            }),
            minifyJSON(), // Minify application/ld+json
        ],
        dest: htmlFolder,
    });
});

// CSS Tasks
let browserSync;
let purgeConfig = {
    mode: "all",
    content: [`${pugFolder}/**/*.pug`],

    // safelist: [/-webkit-scrollbar/, /active/, /show/, /hide/, /light/, /dark/],
    keyframes: false,
    fontFace: false,
    defaultExtractor: (content) => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []; // Capture classes within other delimiters like .block(class="w-1/2") in Pug

        const innerMatches =
            content.match(/[^<>"'`\s.(){}\[\]#=%]*[^<>"'`\s.(){}\[\]#=%:]/g) ||
            [];
        return broadMatches.concat(innerMatches);
    },
};
task("css", async () => {
    const [
        { default: postcss },
        { default: tailwind },
        { default: sassPostcss },
        { default: plumber },
        { default: rename },
    ] = await Promise.all([
        import("gulp-postcss"),
        import("tailwindcss"),
        import("@csstools/postcss-sass"),
        import("gulp-plumber"),
        import("gulp-rename"),
    ]);

    return stream(`${srcCSSFolder}/app.css`, {
        pipes: [
            plumber(),
            postcss([
                tailwind("./tailwind.js"),
                sassPostcss({ outputStyle: "compressed" }),

                // Purge & Compress CSS
                ...(dev ? [] : [
                    (await import("@fullhuman/postcss-purgecss")).default(purgeConfig),
                    (await import("postcss-csso")).default()
                ]),
            ]),
            dev ? null : (await import("gulp-autoprefixer")).default(),
            rename("app.min.css"),
        ],
        dest: destCSSFolder,
        end: browserSync ? [browserSync.stream()] : undefined,
    });
});

// JS Tasks
tasks({
    "modern-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: gzipSize },
            { default: prettyBytes },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gzip-size"),
            import("pretty-bytes"),
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    sourcemap: true,
                    format: "esm",
                    outfile: "modern.min.js",
                    target: ["chrome71"],
                }),
            ],
            dest: jsFolder, // Output
            async end() {
                console.log(
                    `=> Gzip size - ${prettyBytes(
                        await gzipSize.file(`${jsFolder}/modern.min.js`)
                    )}\n`
                );
            },
        });
    },
    "legacy-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
        ] = await Promise.all([import("gulp-esbuild")]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    format: "iife",
                    outfile: "legacy.min.js",
                    target: ["chrome58", "firefox57", "safari11", "edge16"],
                }),
            ],
            dest: jsFolder, // Output
        });
    },
    "other-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: rename },
        ] = await Promise.all([import("gulp-esbuild"), import("gulp-rename")]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream([`${tsFolder}/*.ts`, `!${tsFolder}/${tsFile}`], {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    format: "iife",
                    target: ["chrome58", "firefox57", "safari11", "edge16"],
                }),
                rename({ suffix: ".min", extname: ".js" }), // Rename
            ],
            dest: jsFolder, // Output
        });
    },
    js: parallelFn(`modern-js`, dev ? null : `legacy-js`, `other-js`),
});

// Other assets
task("assets", () => {
    return stream(`${assetsFolder}/**/*`, {
        opts: {
            base: assetsFolder,
        },
        dest: destFolder,
    });
});

// BrowserSync
task("reload", (resolve) => {
    if (browserSync) browserSync.reload();
    delete require.cache[resolve];
    delete require.cache[iconResolve];
    resolve();
});

// Delete destFolder for added performance
task("clean", async (done) => {
    if (netlify) return await Promise.resolve(done());
    const { default: del } = await import("del");
    return del(destFolder);
});

task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            notify: true,
            server: destFolder,
            online: true,
            scrollThrottle: 250,
        },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404.html`,
                });
                res.end("404 Error");
            });
        }
    );

    watch(
        [`${pugFolder}/**/*.pug`, dataPath, iconPath],
        { delay: 200 },
        series(`html`, "reload")
    );
    watch(
        [`${srcCSSFolder}/**/*`, `./tailwind.js`],
        { delay: 350 },
        series(`css`)
    );
    watch(
        [`${tsFolder}/${tsFile}`, `!${tsFolder}/*.ts`, `${tsFolder}/**/*.ts`],
        { delay: 100 },
        series(`modern-js`, `reload`)
    );
    watch(
        [`!${tsFolder}/${tsFile}`, `${tsFolder}/*.ts`],
        { delay: 100 },
        series(`other-js`, `reload`)
    );
    watch(`${assetsFolder}/**/*`, { delay: 500 }, series(`assets`, "reload"));
});

// Build & Watch Tasks
task("build", series("clean", parallel("html", "css", "js", "assets")));

task(
    "default",
    series("clean", parallel("html", "css", "js", "assets"), "watch")
);
