var path = require('path');
var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');

var SRC_JS = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/react/dist/react.min.js',
  'node_modules/react-router/umd/ReactRouter.min.js',
  'components/*.*',
  'app.jsx'
];
var SRC_CSS = [
  'css/style.css'
];

var DEST = './dist/';
var BUNDLE_JS = 'app.min.js';
var BUNDLE_CSS = 'app.min.css';

gulp.task('bundle-js', function () {
  return gulp.src(SRC_JS)
      // transform jsx files
      .pipe(gulpif(isJSX, react()))

      // transform ES6
      .pipe(gulpif(isNoNodeModule, babel()))

      // minify
      .pipe(gulpif(isNonMinified, uglify()))

      // bundle all js in one file
      .pipe(concat(BUNDLE_JS))

      // write to disk
      .pipe(gulp.dest(DEST));
});

gulp.task('bundle-css', function () {
  return gulp.src(SRC_CSS)
      // bundle all css in one file
      .pipe(concatCss(BUNDLE_CSS))

      // minify
      .pipe(minifyCSS())

      // write to disk
      .pipe(gulp.dest(DEST));
});

gulp.task('default', ['bundle-js', 'bundle-css']);

function isJSX (file) {
  return path.extname(file.path) == '.jsx';
}

function isNoNodeModule (file) {
  return file.path.indexOf('node_modules') === -1;
}

function isNonMinified (file) {
  var ext = path.extname(file.path);
  var base = path.basename(file.path, ext); // remove extension
  return path.extname(base) !== '.min';
}