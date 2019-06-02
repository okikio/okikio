let gulp = require('gulp');
let csso = require('gulp-csso');
let uglify = require('gulp-uglify');
let htmlmin = require('gulp-htmlmin');
const { exec } = require('child_process');
let css, js, html;

gulp.task("css", css = () =>
    gulp.src('public/**/*.css')
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('public'))
);

gulp.task("js", js = () =>
    gulp.src("public/**/*.js", { allowEmpty: true })
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('public'))
);

gulp.task('html', html = () =>
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
gulp.task('default', gulp.series('css', 'js', 'html', done => { done(); }));

// Gulp task to check to make sure a file has changed before minify that file files
gulp.task('watch', done => {
    /*gulp.watch('src/** /*.js', { delay: 500 },
        cb => {
            js();
            cb();
        });

    gulp.watch('src/** /*.scss', { delay: 500 },
        cb => {
            css();
            cb();
        });*/

    gulp.watch(['src/**/*.js', 'src/**/*.scss', 'src/**/*.njk', 'src/config.json'], { delay: 500 },
        cb => {
            exec('npm run build', (err, stdout, stderr) => {
                if (err) { return; }

                // the *entire* stdout and stderr (buffered)
                console.log(`${stdout}`);
                console.log(`${stderr}`);
            });
            cb();
        });
});
