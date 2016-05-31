// GULP REQUIRES
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    pixrem = require('gulp-pixrem'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    path = require("path"),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// PATHS
var url = 'aceit.dev';

var base = {
    src: 'src/',
    dest: 'public/assets/',
};

var paths = {
    templates: 'templates/*.tpl.html',
    scss: 'scss/**/*.scss',
    css: 'css/',
    js: 'js/**/*.js',
    jsOut: 'js/',
    img: 'images/**/*',
    imgOut: 'images/',
};

// BROWSER SYNC
gulp.task('browser-sync', function() {
  browserSync.init({
    reloadDelay: 50,
    // server: { baseDir: "~/Repos/express-whs/" } /* static files */
    proxy: url
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

// SASS TASK
gulp.task('sass', function () {
  gulp.src(path.join(base.src, paths.scss))
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(pixrem())
    .pipe(prefix('last 4 versions'))
    .on('error', gutil.log)
    .pipe(gulp.dest(path.join(base.dest, paths.css)))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest(path.join(base.dest, paths.css)))
    .pipe(reload({ stream: true }));
});

// SCRIPTS TASK
gulp.task('scripts', function() {
  return gulp.src(path.join(base.src, paths.js))
    .pipe(concat('main.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest(path.join(base.dest, paths.jsOut)))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest(path.join(base.dest, paths.jsOut)))
    .pipe(reload({stream:true}))
});

// WATCH
gulp.task('default', ['browser-sync'], function () {
  gulp.watch(path.join(base.src, paths.scss), ['sass', 'bs-reload']);
  gulp.watch(path.join(base.src, paths.js), ['scripts', 'bs-reload']);
  gulp.watch(['public/**/*.html'], ['bs-reload'])
  // gulp.watch(['craft/templates/**/*.html'], ['bs-reload']); If using Craft CMS
  // gulp.watch(['craft/templates/**/*.php'], ['bs-reload']);  If using Craft CMS
});