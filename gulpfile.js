var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var data = require('gulp-data');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var merge = require('gulp-merge');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var strip = require('gulp-strip-comments');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');

// The browsers for the css auto-prefix that I want to support
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var BABEL_POLYFILL = 'node_modules/@babel/polyfill/dist/polyfill.js'; // Include polyfills
var JS_LIBRARIES = 'src/js/{anime,jquery,barba,particles,config}*.js'; // All .js libraries and the config.js file

var html, css, js;
var CLIENT_BABEL_OPTS = { 'presets': ['@babel/env'] };

// Use the node-sass compiler
sass.compiler = require('node-sass');

// Gulp task to auto-prefix & minify CSS files
gulp.task("css", css = function css () {
    // Gets the .css files in the src/css folder
    return gulp.src('src/scss/**/*.scss')
        // Create source maps 
        .pipe(sourcemaps.init())
        // Compress and compile SASS
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        // Minify the file
        .pipe(csso())
        // Rename each .css file to `file.min.css`
        .pipe(rename({ suffix: ".min" }))
        // Place sourcemaps in the same folder
        .pipe(sourcemaps.write('.'))
        // Output
        .pipe(gulp.dest('public/css'));
});

// Gulp task to minify JS files
gulp.task("js", js = function js () {
    // Compiles the .js libraries and the congig.js file in the src/js folder together with Babel polyfills into the build.min.js file
    return gulp.src([BABEL_POLYFILL, JS_LIBRARIES])
        // Create source maps 
        .pipe(sourcemaps.init())
        // Put all the code into on build file
        .pipe(concat('build.min.js'))
        // Minify the file
        .pipe(uglify())
        // Place sourcemaps in the same folder
        .pipe(sourcemaps.write('.'))
        // Output
        .pipe(gulp.dest('public/js')),

        // Gets the custom .js files in src/js folder
        gulp.src(["src/js/*.js", "!" + JS_LIBRARIES])
        // Create source maps 
        .pipe(sourcemaps.init())
        // Add babel ES7 support
        .pipe(babel(CLIENT_BABEL_OPTS))
        // Minify the file
        .pipe(uglify())
        // Rename each .js file to `file.min.js`
        .pipe(rename({ suffix: ".min" }))
        // Place sourcemaps in the same folder
        .pipe(sourcemaps.write('.'))
        // Output
        .pipe(gulp.dest('public/js'));
});

// Gulp task to compile .njk (nunjucks) files and partials into minified HTML files
gulp.task('html', html = function html () {
    // Gets the .njk files in the src/templates/pages folder
    return gulp.src('src/templates/pages/*.nj') // Renders template with nunjucks
        // Adds data through the data.json file 
        .pipe(data(function(file) {
            return JSON.parse(fs.readFileSync(path.join(__dirname, 'src') + '/data.json'));
        }))
        // Render .html files, compiling macros and partials into one usable file
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // Minifies html
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        // Output
        .pipe(gulp.dest('public'));
});

// Gulp task to minify all files
gulp.task('default', gulp.series('css', 'js', 'html', function(done) { done(); }));

// Gulp task to check to make sure a file has changed before minify that file files
gulp.task('watch', function(done) {
    gulp.watch('src/js/*.js', { delay: 500 }, 
        function(cb) { js(); cb(); });
        
    gulp.watch('src/scss/**/*.scss', { delay: 500 }, 
        function(cb) { css(); cb(); });
        
    gulp.watch(['src/templates/**/*.nj', 'src/data.json'], { delay: 500 }, 
        function(cb) { html(); cb(); });
});
