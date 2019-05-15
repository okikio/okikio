var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');

// The browsers for the css auto-prefix that I want to support
const AUTOPREFIXER_BROWSERS = [
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

// Gulp task to auto-prefix & minify CSS files
gulp.task("css", function() {
    // Gets the .css files in the src/css folder
    return gulp.src("src/css/*.css")
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        // Minify the file
        .pipe(csso())
        // Add a .min before the .css file extention looks like `file.min.css`
        .pipe(rename({ suffix: '.min' }))
        // Output
        .pipe(gulp.dest('public/css'));
});

// Gulp task to minify JS files
gulp.task("js", function() {
    // Gets the .js files in the src/js folder
    return gulp.src("src/js/*.js")
        // Minify the file
        .pipe(uglify())
        // Add a .min before the .js file extention looks like `file.min.js`
        .pipe(rename({ suffix: '.min' }))
        // Output
        .pipe(gulp.dest('public/js'));
});

// Gulp task to compile .njk (nunjucks) files and partials into minified HTML files
gulp.task('html', function() {
  // Gets the .njk files in the src/templates/pages folder
    return gulp.src('src/templates/pages/*.njk') // Renders template with nunjucks
       .pipe(nunjucksRender({
            path: ['src/templates/']
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('public'));
});

// Gulp task to minify all files
gulp.task('default', gulp.series('css', 'js', 'html', function (done) 
    { done(); }));
