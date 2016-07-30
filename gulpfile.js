var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    prefix         = require('gulp-autoprefixer'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    imagemin       = require('gulp-imagemin'),
    pngquant       = require('imagemin-pngquant'),
    pug           = require('gulp-pug'),
    rename         = require('gulp-rename'),
    cssNano        = require('gulp-cssnano'),
    sourcemaps     = require('gulp-sourcemaps'),
    // minifyHTML     = require('gulp-minify-html'),
    browserSync    = require('browser-sync').create();

/**
 * File Path Settings
 */

var src = {
  pug: './src/*.pug',
  scss: './src/scss/',
  js: './src/js/',
  imgs: './src/imgs/',
  modernizr: './bower_components/modernizr/modernizr.js',
  normalize: './node_modules/normalize.css/normalize.css'
};

var output = {
  html: './output/',
  css: './output/',
  js: './output/js/',
  imgs: './output/imgs/'
};


/**
 * Javascript and Normalize.css minification
 */

// Move Modernizr file to /js/vendor
gulp.task('modernizr', function () {
  return gulp.src(src.modernizr)
    .pipe(uglify())
    .pipe(gulp.dest(output.js + 'vendor/'));
});

// Minimize and move normalize.css to template directory
gulp.task('normalize', function () {
  return gulp.src(src.normalize)
    .pipe(cssNano())
    .pipe(gulp.dest(output.css));
});

// Minify main site Javascript file
gulp.task('appJS', ['modernizr', 'normalize'], function () {
  return gulp.src(src.js + 'app.js')
  .pipe(uglify())
  .pipe(rename('main.js'))
  .pipe(gulp.dest(output.js))
  .pipe(browserSync.stream());
});

/**
 * Compose PUG Files into HTML
 */
gulp.task('pug', function () {
  return gulp.src(src.pug)
    .pipe(pug())
    .pipe(gulp.dest(output.html))
    .pipe(browserSync.stream());
});


/**
 * Sass Processing and compiling
 */

gulp.task('sass', function () {
  return gulp.src(src.scss + 'main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefix({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(cssNano())
      .pipe(rename('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.css))
    .pipe(browserSync.stream());
});

/**
 * Optimizing images
 */

gulp.task('images', function () {
  return gulp.src(src.imgs + '*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(output.imgs))
});

/**
 * Watch Task
 */

gulp.task('watch', ['pug', 'sass', 'images', 'appJS'], function () {
  browserSync.init({
    server: './output'
  });
  gulp.watch(src.pug, ['pug']);
  gulp.watch([src.scss + '**/*.scss', src.scss + '**/*.sass'], ['sass']);
  gulp.watch(src.js + 'app.js', ['appJS']);
  gulp.watch(src.imgs + '*', ['images']);
});


/**
 * Default Task
 */

gulp.task('default', ['watch']);
