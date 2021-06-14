const mode = process.argv.includes("--watch") ? "watch" : "build";

import { watch, task, tasks, series, parallel, seriesFn, parallelFn, stream, streamList } from "./util.js";

import { createRequire } from 'module';
import rename from "gulp-rename";

const require = createRequire(import.meta.url);

// Origin folders (source and destination folders)
const srcFolder = `src`;
const destFolder = `public`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const pugFolder = `${srcFolder}/pug`;
const scssFolder = `${srcFolder}/scss`;
const assetsFolder = `${srcFolder}/assets`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// Main ts file bane
const tsFile = `main.ts`;

// HTML Tasks
const iconPath = `./icons.cjs`;
const iconResolve = require.resolve(iconPath);
task("html", async () => {
    const [
        { default: plumber },
        { default: pug },
        { default: minifyJSON }
    ] = await Promise.all([
        import("gulp-plumber"),
        import("gulp-pug"),
        import('gulp-minify-inline-json')
    ]);

    let icons = require(iconResolve);
    return stream(`${pugFolder}/pages/**/*.pug`, {
        pipes: [
            plumber(), // Recover from errors without cancelling build task

            // Compile src html using Pug
            pug({
                pretty: false,
                basedir: pugFolder,
                self: true,
                data: { icons },
            }),

            minifyJSON(), // Minify application/ld+json
        ],
        end() {
            delete require.cache[iconResolve];
        },
        dest: htmlFolder
    });
});

// CSS Tasks
let browserSync;
task("css", async () => {
    const [
        { default: fiber },

        { default: postcss },
        { default: tailwind },

        { default: _import },

        { default: scss },
        { default: sass },
        { default: easings }
    ] = await Promise.all([
        import("fibers"),

        import("gulp-postcss"),
        import("tailwindcss"),

        import("postcss-easy-import"),

        import("postcss-scss"),
        import("csstools-postcss-sass-pre-release"),
        import("postcss-easings")
    ]);

    return stream(`${scssFolder}/*.scss`, {
        pipes: [
            postcss([
                _import(),
                sass({
                    outputStyle: "compressed",
                    fiber
                }),
                tailwind("tailwind.config.cjs"),
            ], { syntax: scss }),

            postcss([
                easings(),
            ], { syntax: scss }),

            rename({ extname: ".min.css" }), // Rename
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : undefined,
    });
});

// JS tasks
import * as ESBUILD from "gulp-esbuild";
const { default: Esbuild, createGulpEsbuild } = ESBUILD;
tasks({
    "modern-js": async () => {
        let [
            { default: size },
            { default: gulpif }
        ] = await Promise.all([
            import("gulp-size"),
            import("gulp-if")
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild({ incremental: true }) : Esbuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    sourcemap: true,
                    format: "esm",
                    platform: "browser",
                    target: ["es2018"],
                    outfile: "modern.min.js",
                }),

                // Filter out the sourcemap
                // I don't need to know the size of the sourcemap
                gulpif(
                    (file) => !/\.map$/.test(file.path),
                    size({ gzip: true, showFiles: true, showTotal: false })
                )
            ],
            dest: jsFolder, // Output
        });
    },

    "legacy-js": async () => {
        const esbuild = mode == "watch" ? createGulpEsbuild({ incremental: true }) : Esbuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    outfile: "legacy.min.js",
                    target: ["es6"],
                    format: "iife",
                    platform: "browser",
                }),
            ],
            dest: jsFolder, // Output
        });
    },

    "other-js": async () => {
        const esbuild = mode == "watch" ? createGulpEsbuild({ incremental: true }) : Esbuild;
        return stream([`${tsFolder}/*.ts`, `!${tsFolder}/${tsFile}`], {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    entryNames: '[name].min',
                    target: ["es6"],
                    format: "iife",
                    platform: "browser",
                }),
            ],
            dest: jsFolder, // Output
        });
    },

    js: seriesFn(`modern-js`, `legacy-js`, `other-js`),
});

// Other assets
task("assets", () => {
    return stream(`${assetsFolder}/**/*`, {
        opts: { base: assetsFolder },
        dest: destFolder,
    });
});

// Optimize for production
task("optimize", async () => {
    const [
        { default: typescript },
        { default: terser },

        { default: postcss },
        { default: autoprefixer },
        { default: csso },
        { default: purge },
    ] = await Promise.all([
        import("gulp-typescript"),
        import("gulp-terser"),

        import("gulp-postcss"),
        import("autoprefixer"),
        import("postcss-csso"),
        import("@fullhuman/postcss-purgecss"),
    ]);

    return streamList([
        stream([`${jsFolder}/*.js`, `!${jsFolder}/modern.min.js`], {
            pipes: [
                // Support for es5
                typescript({
                    target: "ES5",
                    allowJs: true,
                    checkJs: false,
                    noEmit: true,
                    noEmitOnError: true,
                    sourceMap: false,
                    declaration: false,
                    isolatedModules: true,
                }),

                // Minify
                terser(),
            ],
            dest: jsFolder, // Output
        }),

        stream(`${cssFolder}/*.css`, {
            pipes: [
                // Purge, Compress and Prefix CSS
                postcss([
                    purge({
                        content: [`${htmlFolder}/**/*.html`],
                        keyframes: false,
                        fontFace: false,
                    }),
                    csso(),
                    autoprefixer(),
                ]),
            ],
            dest: cssFolder,
        })
    ]);
});

// Reload Page Task
task("reload", (resolve) => {
    if (browserSync) browserSync.reload();
    resolve();
});

// Delete destFolder for added performance
task("clean", async () => {
    const { default: del } = await import("del");
    return del(destFolder);
});

// Watch for file changes
task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            notify: true,
            server: {
                baseDir: destFolder,
                serveStaticOptions: {
                    cacheControl: false,
                    extensions: ["html"],
                },
            },

            browser: "chrome",
            scrollThrottle: 250,
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

    // Watch Pug & Icons
    watch(
        [`${pugFolder}/**/*.pug`, iconPath],
        { delay: 250 },
        series(`html`, "css", "reload")
    );

    // Watch Tailwind & SCSS
    watch([`${scssFolder}/**/*.scss`, `tailwind.config.cjs`], series(`css`));

    // Watch Typescript & JS
    watch(
        [`${tsFolder}/${tsFile}`, `${tsFolder}/**/*.ts`],
        series(`modern-js`, `legacy-js`, `reload`)
    );

    watch(
        [`!${tsFolder}/${tsFile}`, `${tsFolder}/*.ts`],
        series(`other-js`, `reload`)
    );

    // Watch Other Assets
    watch(`${assetsFolder}/**/*`, { delay: 300 }, series(`assets`, "reload"));
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
