var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var browserSync = require('browser-sync');
var server = browserSync.create();

var paths = {
    styles: {
        src: './scss/**/*.scss',
        dst: './site/assets/styles'
    },
    scripts: {
        src: './scripts/**/*.js',
        dst: './site/assets/scripts'
    },
    pages: {
        src: './site/**/*.html'
    }
}

function reload(){
    server.reload();
}

function serve(){
    server.init({
        server: {
            baseDir: './site'
        }
    });
}

function clean(){
    // removes all content in the destination sub/folder(s) 
    return del(['assets']);
}

function styles(){
    return gulp.src(paths.styles.src)
                .pipe(sass().on('error', sass.logError))
                .pipe(cleanCSS())
                .pipe(rename({
                    basename:   'main',
                    suffix:     '.min'
                }))
                .pipe(gulp.dest(paths.styles.dst))
                .pipe(server.stream());
}

function scripts(){
    return gulp.src(paths.scripts.src, {sourcemaps: true})
                .pipe(babel())
                .pipe(uglify())
                .pipe(concat('main.min.js'))
                .pipe(gulp.dest(paths.scripts.dst))
                .pipe(server.stream());
}
function pages(){
    return gulp.src(paths.pages.src)
                .pipe(server.reload());
}

function watch(){
    serve();
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.pages.src, pages);
}

var build = gulp.series(
    clean,
    gulp.parallel(
        styles,
        scripts
    )
);

exports.clean = clean;
exports.reload = reload;
exports.serve = serve;
exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;
exports.watch = watch;
exports.build = build;

exports.default = build;