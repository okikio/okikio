import gulp from "gulp";
const { src, series, dest, watch, parallel } = gulp;
import {
    netlifyURL,
    websiteURL,
    dev,
    author,
    homepage,
    license,
    copyright,
    keywords,
    github,
    netlify,
} from "./config";
import nodeResolve from "@rollup/plugin-node-resolve";
import purgecss from "@fullhuman/postcss-purgecss";
import querySelector from "posthtml-match-helper";
import minifyJSON from "gulp-minify-inline-json";
import phTransformer from "posthtml-transformer";
import singleSpaces from "typographic-single-spaces";
import commonJS from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { init, write } from "gulp-sourcemaps";
import rollupBabel from "rollup-plugin-babel";
import browserSyncModule from "browser-sync";
import icons from "./material-design-icons";
import postHTMLTextr from "posthtml-textr";
import postHTMLLorem from "posthtml-lorem";
import sass, { logError } from "gulp-sass";
import buble from "@rollup/plugin-buble";
import sitemapModule from "gulp-sitemap";
import autoprefixer from "autoprefixer";
import rollup from "gulp-better-rollup";
import posthtml from "gulp-posthtml";
import htmlmin from "gulp-htmlmin";
import postcss from "gulp-postcss";
import header from "gulp-header";
import rename from "gulp-rename";
import csso from "postcss-csso";
import moment from "moment";
import pug from "gulp-pug";

const browserSync = browserSyncModule.create();
const modernConfig = {
    babelrc: false,
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: false,
                modules: "auto",
                targets: {
                    browsers: ["> 2%"],
                },
            },
        ],
    ],
};

const generalConfig = {
    babelrc: false,
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: false,
                modules: "auto",
                targets: {
                    browsers: ["defaults, IE 8"],
                },
            },
        ],
    ],
};

const bannerContent = [
    ` * @author         ${author.name} (${author.url})`,
    ` * @link           ${homepage}`,
    ` * @github         ${github}`,
    ` * @build          ${moment().format("llll")} ET`,
    ` * @license        ${license}`,
    ` * @copyright      Copyright (c) ${moment().format("YYYY")}, ${copyright}.`,
];

const banner = ["/**", ...bannerContent, ` */`].join("\n");
const bannerHTML = ["<!--", ...bannerContent, `-->`].join("\n");

// Rollup warnings are annoying
let ignoreLog = [
    "CIRCULAR_DEPENDENCY",
    "UNRESOLVED_IMPORT",
    "EXTERNAL_DEPENDENCY",
    "THIS_IS_UNDEFINED",
];
let onwarn = ({ loc, message, code, frame }, warn) => {
    if (ignoreLog.indexOf(code) > -1) return;
    if (loc) {
        warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
        if (frame) warn(frame);
    } else warn(message);
};

// let class_keys = Object.keys(class_map);
let srcMapsWrite = [
    "../maps/",
    {
        sourceMappingURL: (file) => {
            return `/maps/${file.relative}.map`;
        },
    },
];

let minifyOpts = {
    keep_fnames: false, // change to true here
    toplevel: true,
    compress: {
        dead_code: true,
        pure_getters: true,
    },
    output: {
        comments: /^!/,
    },
    ecma: 2017,
    safari10: false,
};
let publicDest = "public";
let minSuffix = { suffix: ".min" };
let watchDelay = { delay: 1000 };
let { assign } = Object;

// Streamline Gulp Tasks
let stream = (_src, _opt = {}) => {
    let _end = _opt.end || [];
    let host = src(_src, _opt.opts),
        _pipes = _opt.pipes || [],
        _dest = _opt.dest || publicDest,
        _log = _opt.log || (() => { });

    return new Promise((resolve, reject) => {
        _pipes.forEach((val) => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val).on("error", reject);
            }
        });

        host
            .on("end", _log)
            .on("error", reject)
            .pipe(dest(_dest))
            .on("end", resolve); // Output

        _end.forEach((val) => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val);
            }
        });
    });
};

// A list of streams
let streamList = (...args) => {
    return Promise.all(
        (Array.isArray(args[0]) ? args[0] : args).map((_stream) => {
            return Array.isArray(_stream) ? stream(..._stream) : _stream;
        })
    );
};

//#region HTML
export const html = () => {
    return stream("views/pages/**/*.pug", {
        pipes: [
            // Pug compiler
            pug({
                locals: { dev, websiteURL, netlifyURL, netlify, keywords },
                basedir: "views",
                self: true,
            }),
            minifyJSON(), // Minify application/ld+json
            // Rename
            rename({ extname: ".html" }),
            // Minify or Beautify html
            dev
                ? null
                : htmlmin({
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    removeEmptyAttributes: false,
                    removeRedundantAttributes: true,
                    processScripts: ["application/ld+json"],
                }),
            header(bannerHTML),
        ],
    });
};
//#endregion

//#region CSS
export const css = () => {
    return stream("src/scss/*.scss", {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: dev ? "expanded" : "compressed" }).on(
                "error",
                logError
            ),
            rename(minSuffix), // Rename
            // Autoprefix, Remove unused CSS & Compress CSS
            postcss([
                purgecss({
                    content: [`${publicDest}/**/*.html`],
                    whitelistPatterns: [
                        /-show$/,
                        /-initial$/,
                        /-hide$/,
                        /navbar-focus/,
                        /navbar-link-focus/,
                        /btn-expand/,
                        /at-top/,
                    ],
                    keyframes: false,
                    fontFace: false,
                }),
                autoprefixer({
                    overrideBrowserslist: ["defaults, IE 8"],
                }),
                csso(),
            ]),
        ],
        dest: `${publicDest}/css`, // Output
        end: [browserSync.stream()],
    });
};
//#endregion

//#region JS
const coreJS_Stream = (type) => {
    let gen = type === "general";
    return stream(`src/js/app.js`, {
        pipes: [
            init(), // Sourcemaps init
            // Bundle Modules
            rollup(
                {
                    treeshake: true,
                    plugins: [
                        // rollupJSON(), // Parse JSON Exports
                        commonJS(), // Use CommonJS to compile the program
                        nodeResolve(), // Bundle all Modules
                        gen ? rollupBabel(generalConfig) : rollupBabel(modernConfig), // Babelify file for uglifing
                    ].concat(
                        // Minify the file
                        terser(assign({}, minifyOpts, gen ? { ie8: true, ecma: 5 } : {}))
                    ),
                    onwarn,
                },
                gen ? "iife" : "es"
            ),
            rename(`${type}.min.js`), // Rename
            header(banner),
            write(...srcMapsWrite), // Put sourcemap in public folder
        ],
        dest: `${publicDest}/js`, // Output
    });
};

export const modernJS = () => {
    return coreJS_Stream("modern");
};

export const generalJS = (done) => {
    if (!dev) return coreJS_Stream("general");
    else done();
};

export const coreJS = series(modernJS, generalJS);
export const otherJS = () => {
    return stream(["src/js/*.js", "!src/js/app.js"], {
        pipes: [
            // Bundle Modules
            rollup(
                {
                    treeshake: true,
                    plugins: [
                        commonJS(), // Use CommonJS to compile the program
                        nodeResolve(), // Bundle all Modules
                        // Babelify file for uglifing
                        buble({
                            transforms: { asyncAwait: false },
                            // custom `Object.assign` (used in object spread)
                            objectAssign: "Object.assign",
                        })
                    ].concat(
                        // Minify the file
                        terser(assign({}, minifyOpts, { ie8: true, ecma: 5 }))
                    ),
                    onwarn,
                },
                "iife"
            ),

            rename(minSuffix), // Rename
        ],
        dest: `${publicDest}/js`, // Output
    });
};

export const js = series(coreJS, otherJS);
//#endregion

//#region CLIENT
export const client = () => {
    return stream("client/**/*");
};
//#endregion

//#region POSTHTML
export const posthtmlFn = () => {
    return stream(`${publicDest}/**/*.html`, {
        pipes: [
            posthtml([
                // Test processes
                postHTMLTextr({}, [singleSpaces]),
                postHTMLLorem(),
            ]),
        ],
    });
};
//#endregion

//#region SITEMAP
export const sitemap = () => {
    return stream(`${publicDest}/**/*.html`, {
        pipes: [
            sitemapModule({
                siteUrl: websiteURL,
            }),
        ],
    });
};
//#endregion

//#region INLINE ASSETS/JS & CSS
export const inlineAssets = () => {
    return stream(`${publicDest}/**/*.html`, {
        pipes: [
            posthtml([
                (tree) => {
                    tree.match(querySelector("i.action-icon"), (node) => {
                        if ("inline" in node.attrs) {
                            const _attrs = node.attrs;
                            const _content = node.content;
                            delete _attrs["inline"];
                            delete _attrs["async"];
                            node = {
                                tag: "svg",
                                attrs: {
                                    width: "24",
                                    height: "24",
                                    viewBox: "0 0 24 24",
                                    fill: "currentcolor",
                                    ..._attrs,
                                },
                                content: [
                                    {
                                        tag: "path",
                                        attrs: { d: icons[_content] },
                                    },
                                ],
                            };
                        }

                        return node;
                    });
                },
            ]),
        ],
    });
};
export const inlineJS_CSS = () => {
    return streamList([
        [
            `${publicDest}/**/*.html`,
            {
                pipes: [
                    posthtml([
                        (tree) => {
                            tree.walk((node) => {
                                if (node.tag != "html") {
                                    let _attrs = node.attrs || {},
                                        key;
                                    if ("ph-inline" in _attrs) {
                                        node.attrs = { ..._attrs };
                                        key = node.tag == "link" ? "href" : "src";
                                        node.attrs[key] = node.attrs[key].slice(1);
                                    }
                                }
                                return node;
                            });
                        },
                        // Dom process
                        phTransformer({
                            root: `./${publicDest}`,
                            minifyJS: false,
                            minifyCSS: false,
                        }),
                    ]),
                ],
            },
        ],
    ]);
};
//#endregion

//#region RELOAD
export const reload = (done) => {
    stream(`${publicDest}/**/*.html`, {}).then((...args) => {
        browserSync.reload();
        done(...args);
    });
};
//#endregion

//#region TASKS
// Gulp task to minify all files
export const develop = series(parallel(client, html, js), css);

// Gulp task to run before watching for file changes
export const frontend = series(develop, posthtmlFn, inlineAssets);
//#endregion

//#region WATCH
// Gulp task to check to make sure a file has changed before minify that file
export const watchFiles = () => {
    browserSync.init(
        {
            server: `./${publicDest}`,
        },
        (...args) => {
            let [, $this] = args;
            $this.addMiddleware("*", (...args) => {
                let [, res] = args;
                res.writeHead(302, {
                    location: "/404.html",
                });

                res.end("Redirecting!");
            });
        }
    );

    watch(
        "views/**/*.pug",
        watchDelay,
        series(html, css, posthtmlFn, inlineAssets, reload)
    );
    watch("src/**/*.scss", watchDelay, css);
    watch("src/**/*.js", watchDelay, series(js, inlineAssets, reload));
    watch("client/**/*", watchDelay, series(client, inlineAssets, reload));
};

// Gulp task to check to make sure a frontend file has changed before minifing that file
export const watchFrontend = () => {
    watch(
        "views/**/*.pug",
        watchDelay,
        series(parallel(html, css), posthtmlFn, inlineAssets)
    );
    watch("src/**/*.scss", watchDelay, css);
    watch("src/**/*.js", watchDelay, js);
};

// Avoid the overhead of calling esm twice
export const doWatchFiles = series(frontend, watchFiles);
//#endregion

//#region BUILD
// Gulp task to minify all files, and inline them in the pages
export default series(
    develop,
    posthtmlFn,
    parallel(sitemap, inlineAssets),
    inlineJS_CSS
);
//#endregion