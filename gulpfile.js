let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() === "true";
let debug = 'debug' in env && env.debug.toString() === "true";

const gulp = require('gulp');
const { src, task, series, parallel, dest, watch } = gulp;

const nodeResolve = require('@rollup/plugin-node-resolve');
const builtins = require("rollup-plugin-node-builtins");
const querySelector = require("posthtml-match-helper");
const browserSync = require('browser-sync').create();
const commonJS = require('@rollup/plugin-commonjs');
const { init, write } = require('gulp-sourcemaps');
const rollupBabel = require('rollup-plugin-babel');
const rollupJSON = require("@rollup/plugin-json");
const { babelConfig } = require("./browserlist");
const rollup = require('gulp-better-rollup');
const { spawn } = require('child_process');
const posthtml = require('gulp-posthtml');
const imagemin = require('gulp-imagemin');
const { html } = require('gulp-beautify');
const htmlmin = require('gulp-htmlmin');
const assets = require("cloudinary").v2;
const postcss = require('gulp-postcss');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const config = require('./config');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const https = require('https');

let { cloud_name, imageURLConfig } = config;
let assetURL = `https://res.cloudinary.com/${cloud_name}/`;
assets.config({ cloud_name, secure: true });

// Rollup warnings are annoying
let ignoreLog = ["CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT", 'EXTERNAL_DEPENDENCY', 'THIS_IS_UNDEFINED'];
let onwarn = ({ loc, message, code, frame }, warn) => {
    if (ignoreLog.indexOf(code) > -1) return;
    if (loc) {
        warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
        if (frame) warn(frame);
    } else warn(message);
};

let srcMapsWrite = ["../maps", {
    sourceMappingURL: file => {
        return `/maps/${file.relative}.map`;
    }
}];

let minifyOpts = {
    keep_fnames: false, // change to true here
    toplevel: true,
    compress: {
        dead_code: true,
        pure_getters: true
    },
    ecma: 8,
    safari10: true
};
let minSuffix = { suffix: ".min" };
let watchDelay = { delay: 1000 };
let publicDest = 'public';
let { assign } = Object;

// Streamline Gulp Tasks
let stream = (_src, _opt = { }) => {
    let _end = _opt.end || [];
    let host = src(_src, _opt.opts), _pipes = _opt.pipes || [], _dest = _opt.dest || publicDest;
    return new Promise((resolve, reject) => {
        _pipes.forEach(val => {
            if (val !== undefined && val !== null)
                { host = host.pipe(val).on('error', reject); }
        });

        host = host.pipe(dest(_dest))
                   .on('error', reject)
                   .on('end', resolve); // Output
        _end.forEach(val => {
            if (val !== undefined && val !== null)
                { host = host.pipe(val); }
        });
    });
};

// A list of streams
let streamList = (...args) => {
    return Promise.all(
        (Array.isArray(args[0]) ? args[0] : args).map(_stream =>
            Array.isArray(_stream) ? stream(..._stream) : _stream
        )
    );
};

// Based on: [https://gist.github.com/millermedeiros/4724047]
let _exec = cmd => {
    var parts = cmd.toString().split(/\s+/g);
    return new Promise((resolve = () => {}) => {
        spawn(parts[0], parts.slice(1), { shell: true, stdio: 'inherit' })
            .on('data', data => process.stdout.write(data))
            .on('error', err => console.error(err))
            .on('close', () => (resolve || function () {}) ());
    });
};

// Execute multiple commands in series
let _execSeries = (...cmds) => {
    return Promise.all(
        cmds.reduce((acc, cmd, i) => {
            if (cmd !== null && cmd !== undefined)
                acc[i] = typeof cmd === "string" ? _exec(cmd) : cmd;
            return acc;
        }, [])
    );
};

task('html', () => stream(
    'views/pages/*.pug', {
        pipes: [
            // Pug compiler
            pug({ locals: { cloud_name, dev, debug } }),
            // Rename
            rename({ extname: ".html" }),
            // Minify or Beautify html
            dev ? html({ indent_size: 4 }) : htmlmin({
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
                collapseWhitespace: true,
                removeEmptyAttributes: false,
                removeRedundantAttributes: true,
                processScripts: ["application/ld+json"]
            })
        ]
    })
);

task("css", () =>
    stream('src/scss/*.scss', {
        pipes: [
            // init(), // Sourcemaps init
            // Minify scss to css
            sass({ outputStyle: dev ? 'expanded' : 'compressed' }).on('error', sass.logError),
            // Autoprefix &  Remove unused CSS
            postcss(), // Rest of code is in postcss.config.js
            rename(minSuffix), // Rename
            // write(...srcMapsWrite) // Put sourcemap in public folder
        ],
        dest: `${publicDest}/css`, // Output
        end: [browserSync.stream()]
    })
);

task("js", () =>
    streamList([
        ...["modern"].concat(!dev ? "general" : [])
            .map(type => {
                let gen = type === 'general';
                return ['src/js/app.js', {
                    opts: { allowEmpty: true },
                    pipes: [
                        // dev ? null : init(), // Sourcemaps init
                        // Bundle Modules
                        rollup({
                            plugins: [
                                builtins(), // Access to builtin Modules
                                rollupJSON(), // Parse JSON Exports
                                commonJS(), // Use CommonJS to compile the program
                                nodeResolve(), // Bundle all Modules
                                rollupBabel(babelConfig[type]) // Babelify file for uglifing
                            ],
                            onwarn
                        }, gen ? 'iife' : 'es'),
                        // Minify the file
                        debug ? null : terser(
                            assign({}, minifyOpts, gen ? { ie8: true, ecma: 5 } : {})
                        ),
                        rename(`${type}.min.js`), // Rename
                        // dev ? null : write(...srcMapsWrite) // Put sourcemap in public folder
                    ],
                    dest: `${publicDest}/js` // Output
                }];
            }),
            [['src/js/*.js', '!src/js/app.js'], {
            opts: { allowEmpty: true },
            pipes: [
                // dev ? null : init(), // Sourcemaps init
                // Bundle Modules
                rollup({
                    plugins: [
                        builtins(), // Access to builtin Modules
                        rollupJSON(), // Parse JSON Exports
                        commonJS(), // Use CommonJS to compile the program
                        nodeResolve(), // Bundle all Modules
                        rollupBabel(babelConfig.general) // Babelify file for uglifing
                    ],
                    onwarn
                }, 'iife'),
                // Minify the file
                debug ? null : terser(
                    assign({}, minifyOpts, { ie8: true, ecma: 5 })
                ),
                rename(minSuffix), // Rename
                // dev ? null : write(...srcMapsWrite) // Put sourcemap in public folder
            ],
            dest: `${publicDest}/js` // Output
        }]
    ])
);

task("assets", () =>
    streamList([
        [["assets/**/*", "!assets/**/*.{png,ico,svg}"], {
            opts: { allowEmpty: true }
        }],
        [["assets/**/*.{png,ico,svg}"], {
            opts: { allowEmpty: true },
            pipes: [ imagemin() ]
        }]
    ])
);

task("gulp:reload", () => {
    _execSeries("gulp pre-watch", "gulp watch");
    process.exit();
});

task("git:push", () => {
    let commit = process.argv[3] || 'Upgrade';
    return _execSeries(
        "git add --ignore-removal .",
        `git commit -m '${commit}'`,
        "git push -u origin master"
    )
});

task("git:pull", () =>
    _exec("git pull origin master")
);

task('posthtml', () =>
    stream('public/*.html', {
        pipes: [
            posthtml([
                // Test processes
                require('posthtml-textr')({}, [
                    require('typographic-single-spaces')
                ]),
                require('posthtml-lorem')(),
            ])
        ]
    })
);

task('inline-assets', () =>
    stream('public/*.html', {
        pipes: [
            posthtml([
                debug ? () => {} : tree => {
                    let parse = (_src = "src") => node => {
                        let url = node.attrs[_src].replace(/&amp;/g, "&");
                        let URLObj = new URL(`${assetURL + url}`.replace("/assets/", ""));
                        let query = URLObj.searchParams;
                        let queryString = URLObj.search;

                        let height = query.get("h");
                        let width = query.get("w") || 'auto';
                        let crop = query.get("crop");
                        let effect = query.get("effect");
                        let quality = query.get("quality");
                        let _imgURLConfig = assign({ ...imageURLConfig, width, height, quality, crop, effect },
                                /svg/g.test(url) ? { fetch_format: null } : {});

                        node.attrs[_src] = (/\/raw\/[^\s"']+/.test(url) ?
                            `${assetURL + url.replace(queryString, '')}` :
                            assets.url(url.replace(queryString, ''), _imgURLConfig)
                        ).replace("/assets/", "");
                        return node;
                    };

                    tree.match(querySelector("[src^='/assets/']"), parse());
                    tree.match(querySelector("[data-src^='/assets/']"), parse("data-src"));
                    // tree.match(querySelector("[href^='/assets/']"), parse("href"));
                    tree.match(querySelector("[srcset^='/assets/']"), parse("srcset"));
                    tree.match(querySelector("[data-srcset^='/assets/']"), parse("data-srcset"));
                },
                debug ? () => {} : async tree => {
                    let warnings, promises = [];
                    tree.match({ tag: 'img' }, node => {
                        if (promises.length >= 2) return node; // Don't inline everything
                        if (node.attrs && node.attrs.src && "inline" in node.attrs) {
                            const { inline, async, ..._attrs } = node.attrs;
                            const _src = _attrs.src;
                            if (!_src.includes("data:image/")) {
                                promises.push(
                                    new Promise((resolve, reject) => {
                                        https.get(_src, res => {
                                            let contentType = res.headers["content-type"];
                                            let body = `data:${contentType};base64,`;

                                            res.setEncoding('base64');
                                            res.on('data', data => { body += data });
                                            res.on('end', () => {
                                                node.attrs = { ..._attrs, src: body };
                                                resolve(node);
                                            });
                                        }).on('error', err => {
                                            console.error(`The image with the src: ${_src} `, err);
                                            reject(node);
                                        });
                                    })
                                );
                            }
                        }

                        return node;
                    });

                    await Promise.all(promises);

                    // Filter errors from messages as warnings
                    warnings = tree.messages.filter(msg => msg instanceof Error);
                    if (warnings.length) {
                        // Conditionally warn the user about any issues
                        console.warn(`\nWarnings (${warnings.length}):\n${warnings.map(msg => `  ${msg.message}`).join('\n')}\n`);
                    }

                    // Return the ast
                    return tree;
                },
                debug ? () => {} : tree => {
                    let icons = require('microicon');
                    tree.match(querySelector("i.action-icon"), node => {
                        if ("inline" in node.attrs) {
                            const { inline, async, ..._attrs } = node.attrs;
                            const _content = node.content;
                            node = {
                                tag: 'svg',
                                attrs: {
                                    width: '24', height: '24',
                                    viewBox: '0 0 24 24',
                                    fill: 'currentcolor',
                                    ..._attrs
                                },
                                content: [{
                                    tag: 'path',
                                    attrs: { d: icons[_content] },
                                }]
                            };
                        }

                        return node;
                    });
                },
            ])
        ]
    })
);

task('inline-js-css', () =>
    stream('public/*.html', {
        pipes: [
            posthtml([
                // Dom process
                debug ? () => { } : require('posthtml-inline-assets')({
                    transforms: { image: false }
                }),
            ])
        ]
    })
);

task('reload', done =>
    stream('public/*.html', { })
        .then((...args) => {
            browserSync.reload();
            done(...args);
        })
);

// Gulp task to minify all files
task('dev', parallel("assets", series(parallel("html", "js"), "css")));

// Gulp task to minify all files, and inline them in the pages
task('default', parallel(series("dev", "posthtml", "inline-assets", "inline-js-css")));

// Gulp task to run before watching for file changes
task('pre-watch', parallel(series("dev", "posthtml", "inline-assets")));

// Gulp task to check to make sure a file has changed before minify that file files
task('watch', () => {
    browserSync.init({ server: "./public" });

    watch(['gulpfile.js', 'postcss.config.js'], watchDelay, series('gulp:reload', 'reload'));

    watch('views/**/*.pug', watchDelay, series('html', 'css', "posthtml", "inline-assets", 'reload'));
    watch('src/**/*.scss', watchDelay, series('css'));
    watch('src/**/*.js', watchDelay, series('js', 'reload'));
    watch(['assets/**/*'], watchDelay, series('assets', "inline-assets", 'reload'));
});
