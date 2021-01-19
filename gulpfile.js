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
    streamList,
} = require("./util");

const dotenv = "dev" in process.env ? process.env : require("dotenv");
if (typeof dotenv.config === "function") dotenv.config();

const env = process.env;
const dev = "dev" in env ? env.dev == "true" : false;

// Origin folders (source and destination folders)
const srcFolder = `build`;
const destFolder = `public`;

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
                data: { ...data, icons },
            }),
            minifyJSON(), // Minify application/ld+json
        ],
        dest: htmlFolder,
    });
});

// CSS Tasks
let browserSync;
tasks({
    async appCSS() {
        const [
            { default: postcss },
            { default: tailwind },
            { default: sass },
            { default: plumber },
            { default: rename },
            { default: parser },
        ] = await Promise.all([
            import("gulp-postcss"),
            import("tailwindcss"),
            import("./sass-postcss.js"),
            import("gulp-plumber"),
            import("gulp-rename"),
            import("postcss-scss"),
        ]);

        return stream(`${srcCSSFolder}/app.scss`, {
            pipes: [
                plumber(),
                postcss([
                    tailwind("./tailwind.js"),
                    sass({ outputStyle: "compressed" }),
                ], { parser }),
                rename({ extname: ".css" }),
            ],
            dest: destCSSFolder,
            end: browserSync ? [browserSync.stream()] : undefined,
        });
    },

    async tailwindCSS() {
        const [
            { default: postcss },
            { default: tailwind },
            { default: plumber },
            { default: parser },
        ] = await Promise.all([
            import("gulp-postcss"),
            import("tailwindcss"),
            import("gulp-plumber"),
            import("postcss-scss"),
        ]);

        return stream(`${srcCSSFolder}/tailwind.css`, {
            pipes: [
                plumber(),
                postcss([tailwind("./tailwind.js")], { parser }),
            ],
            dest: destCSSFolder,
            end: browserSync ? [browserSync.stream()] : undefined,
        });
    },

    css: parallelFn("appCSS", "tailwindCSS"),
});

// JS Tasks
tasks({
    "modern-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: gzipSize },
            { default: prettyBytes },
            { default: plumber },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gzip-size"),
            import("pretty-bytes"),
            import("gulp-plumber"),
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                plumber(),

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
            { default: plumber },
        ] = await Promise.all([import("gulp-esbuild"), import("gulp-plumber")]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                plumber(),

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
            { default: plumber },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-rename"),
            import("gulp-plumber"),
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream([`${tsFolder}/*.ts`, `!${tsFolder}/${tsFile}`], {
            pipes: [
                plumber(),

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

let purgeConfig = {
    mode: "all",
    content: [`${pugFolder}/**/*.pug`],

    safelist: [/-webkit-scrollbar/, /active/, /show/, /hide/, /light/, /dark/],
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
task("optimize", async () => {
    const [
        { default: querySelector },
        { default: posthtml },
        { default: concat },

        { default: postcss },
        { default: autoprefixer },
        { default: csso },
        { default: purge },
    ] = await Promise.all([
        import("posthtml-match-helper"),
        import("gulp-posthtml"),
        import("gulp-concat"),

        import("gulp-postcss"),
        import("autoprefixer"),
        import("postcss-csso"),
        import("@fullhuman/postcss-purgecss"),
    ]);

    const query = querySelector(`link.style-module, meta#concat-style`);
    return streamList([
        [
            `${htmlFolder}/**/*.html`,
            {
                pipes: [
                    posthtml([
                        (tree) => {
                            tree.match(query, (node) => {
                                let attrs = node?.attrs;
                                if (attrs?.class == "style-module") {
                                    delete node;
                                    return;
                                } else if (attrs?.id == "concat-style") {
                                    node.tag = "link";
                                    node.attrs = {
                                        rel: "stylesheet",
                                        href: "/css/app.min.css",
                                        async: "",
                                    };
                                }

                                return node;
                            });
                        },
                    ]),
                ],
                dest: htmlFolder,
            },
        ],
        [
            `${destCSSFolder}/*.css`,
            {
                pipes: [
                    concat("app.min.css"),
                    postcss([
                        // Purge, Compress and Prefix CSS
                        purge(purgeConfig),
                        csso(),
                        autoprefixer(),
                    ]),
                ],
                dest: destCSSFolder,
            },
        ],
    ]);
});

// BrowserSync
task("reload", (resolve) => {
    if (browserSync) browserSync.reload();
    delete require.cache[resolve];
    delete require.cache[iconResolve];
    resolve();
});

// Delete destFolder for added performance
task("clean", async () => {
    const { default: fn } = await import("fs");
    if (!fn.existsSync(destFolder)) return Promise.resolve();

    const { default: del } = await import("del");
    return del(destFolder);
});

task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            notify: true,
            server: {
                baseDir: destFolder,
                serveStaticOptions: {
                    extensions: ["html"],
                },
            },
            cors: true,
            online: true,
            reloadOnRestart: true,
            scrollThrottle: 250,
            middleware: function (req, res, next) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                next();
            },
        },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404`,
                });
                res.end("404 Error");
            });
        }
    );

    // Watch Pug & HTML
    watch(
        [`${pugFolder}/**/*.pug`, dataPath, iconPath],
        { delay: 200 },
        series(`html`, "reload")
    );

    // Watch Tailwind, Sass, & CSS
    watch([`${srcCSSFolder}/**/*.scss`], series(`appCSS`)); // { delay: 200 }, 
    watch([`./tailwind.js`], { delay: 350 }, series(`css`));

    // Watch Typescript & JS
    watch(
        [`!${tsFolder}/*.ts`, `${tsFolder}/**/*.ts`],
        { delay: 100 },
        series(`modern-js`)
    );
    watch(
        [`!${tsFolder}/${tsFile}`, `${tsFolder}/*.ts`],
        { delay: 100 },
        series(`other-js`)
    );
    watch([`${jsFolder}/**/*.js`], { delay: 100 }, series(`reload`));

    // Watch Other Assets
    watch(`${assetsFolder}/**/*`, { delay: 500 }, series(`assets`, "reload"));
});

// Build & Watch Tasks
task(
    "build",
    series("clean", parallel("html", "css", "js", "assets"), "optimize")
);

task(
    "default",
    series("clean", parallel("html", "css", "js", "assets"), "watch")
);
