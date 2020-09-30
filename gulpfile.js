// GULP REQUIRES
const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const cssImport = require('postcss-import');
const cssNested = require('postcss-nested');
const cssPreset = require('postcss-preset-env');
const cssAutoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');


// CSS
function css() {
  var plugins = [
    cssImport(),
    cssNested(),
    cssPreset({stage: 1}),
    cssAutoprefixer(),
    // cssNano(),
  ];
  return src('src/css/style.css')
    .pipe(postcss(plugins))
    .pipe(dest('public/assets/css/'))
    .pipe(browserSync.stream());
}


// JS
function js() {
  return src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(dest('public/assets/js/'))
    // .pipe(browsersync.reload());
}


// BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}

// WATCH
function watchFiles(done) {
  browserSync.init({
    proxy: 'website.test',
    reloadDelay: 50,
    notify: false,
    open: false
  });
  
  watch("src/css/**/*", css);
  watch("src/js/**/*", js);
  watch('templates/**/*', reload);
  
  done();
}


// DEFINE COMPLEX TASKS
const build = parallel(css, js);
const watching = parallel(watchFiles);


// EXPORT TASKS
exports.css = css;
exports.js = js;
exports.reload = reload;
exports.build = build;
exports.watch = watching;
exports.default = watching;