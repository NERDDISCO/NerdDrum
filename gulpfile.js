var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    streamqueue  = require('streamqueue'),
    nodemon = require('gulp-nodemon'),
    babel = require('gulp-babel'),
    addsrc = require('gulp-add-src'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    del = require('del'),
    envify = require('envify')
;





/*
 * Paths
 */
var path = {
  root_src : 'src/',
  root_public : 'public/',
  root_tmp : 'tmp/'
};

// JavaScript paths
path.js = {

  base : './' + path.root_src + 'js/',

  src : [
    path.root_src + 'js/vendor/*'
  ],

  babel : [
    path.root_src + 'js/lib/**/*',
    path.root_src + 'js/index.js'
  ],

  destination : path.root_public + 'asset/js/',
  destination_file : 'NERDDISCO-NerdDrum.js'
};

// SASS paths
path.sass = {
  src : path.root_src + 'sass/*',
  destination : path.root_public + 'asset/css/',
};





/**
 * Remove temporary JS files
 */
gulp.task('clean-temp', function() {
  return del([path.root_tmp]);
});


/*
 * Convert ES6 to CommonJS
 */
gulp.task('es6-commonjs',['clean-temp'], function() {
  return gulp.src(path.js.babel, { base: path.js.base })
    .pipe(plumber())
    .pipe(babel())
    .pipe(addsrc(path.js.src))
    .pipe(gulp.dest(path.root_tmp));
});


/*
 * Create a bundle of the generated CommonJS files inside the tmp folder
 */
gulp.task('commonjs-bundle',['es6-commonjs'], function() {
  // Use index.js as the entry point to load all other modules
  return browserify([path.root_tmp + '/index.js'])
    // Load environment variables from node and replace them
    .transform('envify', { global: true, _: 'purge' })
     // Create a bundle of all the files that are imported into index.js
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(rename(path.js.destination_file))
    .pipe(gulp.dest(path.js.destination));
});





/*
 * SASS
 */
gulp.task('sass', function () {
  gulp.src(path.sass.src)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(path.sass.destination));
});





/*
 * nodemon
 */
gulp.task('nodemon', function () {
  nodemon(require('./nodemon.json'));
});





/**
 * Watch everything to rebuild:
 * - JS
 * - SASS
 */
gulp.task('watcher', function() {
  // watch for JS changes
  gulp.watch([path.js.src, path.js.babel], [ 'commonjs-bundle' ]);

  // watch for SASS changes
  gulp.watch(path.sass.src, [ 'sass' ]);
});





/*
 * Default
 *
 * - start the server using nodemon
 * - start watching of file changes
 */
gulp.task('default', [ 'nodemon', 'watcher']);
