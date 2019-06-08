let gulp = require('gulp');
let csso = require('gulp-csso');
let babel = require('gulp-babel');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify');
let htmlmin = require('gulp-htmlmin');
const { exec } = require('child_process');

gulp.task("css", () =>
    gulp.src('public/**/*.css')
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('public'))
);

gulp.task("server", () =>
    gulp.src(["server.js", "render.js"], { allowEmpty: true })
    // ES5 server.js for uglifing
    .pipe(babel({
        presets: ['@babel/env']
    }))
    // Minify the file
    .pipe(uglify())
    // Rename
    .pipe(rename({ suffix: ".min", }))
    // Output
    .pipe(gulp.dest('.'))
);

gulp.task("git", (cb) => {
    let process = exec('git add -A && git commit -m "Upgrade" && git push origin master && git push heroku master');
    process.stdout.on('data', data => { console.log(data); });
    process.stderr.on('data', data => { console.log(data); });
    cb();
});

gulp.task("js", () =>
    gulp.src("public/**/*.js", { allowEmpty: true })
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('public'))
);

gulp.task('html', () =>
    gulp.src('public/**/*.html')
    // Minifies html
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    // Output
    .pipe(gulp.dest('public'))
);

// Gulp task to minify all files
gulp.task('default', gulp.series('css', 'js', 'html', 'server', done => { done(); }));

// Gulp task to check to make sure a file has changed before minify that file files
gulp.task('watch', done => {
    gulp.watch(['src/**/*.js', 'src/**/*.scss', 'src/**/*.njk', 'config.js'], { delay: 500 },
        cb => {
            let process = exec('npm run build');
            process.stdout.on('data', data => { console.log(data); });
            process.stderr.on('data', data => { console.log(data); });
            process.on('close', data => { console.log(data); });
            cb();
        });
});
