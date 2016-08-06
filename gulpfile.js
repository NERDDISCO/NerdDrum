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
    del = require('del')
;





/*
 * Paths
 */
var path = {
  root_src : 'src/',
  root_public : 'public/'
};

// JavaScript paths
path.js = {

  src : [
    path.root_src + 'js/vendor/*'
  ],

  babel : [
    path.root_src + 'js/lib/**/*',
    path.root_src + 'js/index.js'
  ],

  destination : path.root_public + 'asset/js/',
  destination_file : 'NERDDISCO.js'
};

// SASS paths
path.sass = {
  src : path.root_src + 'sass/*',
  destination : path.root_public + 'asset/css/',
  destination_file : 'NERDDISCO.css'
};










/**
 * Remove tmp folder
 */
gulp.task('clean-temp', function(){
  return del(['tmp']);
});

/*
 * Convert ES6 to Commonjs
 */
gulp.task('es6-commonjs',['clean-temp'], function(){
  return gulp.src(path.js.babel, { base: './src/js/' })
    .pipe(babel())
    .pipe(addsrc(path.js.src))
    .pipe(gulp.dest('tmp'));
});

/*
 *
 */
gulp.task('bundle-commonjs-clean', function(){
  return del(['es5/commonjs']);
});

gulp.task('commonjs-bundle',['bundle-commonjs-clean','es6-commonjs'], function(){
  return browserify(['tmp/index.js']).bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(rename('NERDDISCO-NerdDrum.js'))
    .pipe(gulp.dest(path.js.destination));
});











gulp.task('js', function () {
  return browserify('./')

  return gulp.src(path.js.babel)

    .pipe(plumber())
    .pipe(babel())
    .pipe(addsrc(path.js.src))

    // .pipe(order(path.js.src))
    .pipe(concat(path.js.destination_file))

    // .pipe(uglify())
    .pipe(gulp.dest(path.js.destination))
  ;
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
 * Watch everything:
 *
 * - JS
 * - HTML (angular views)
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
