var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('assets/image/src/*')
      .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('assets/image/dist/'));
});

gulp.task('styles', function(){
  gulp.src(['assets/sass/**/*.scss'])
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
        }}))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(autoprefixer('last 2 versions'))
      .pipe(gulp.dest('assets/css/'))
      .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('assets/js/**/*.js')
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
        }}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('assets/js/src'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('assets/js/dist'))
      .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("assets/sass/**/*.scss", ['styles']);
  gulp.watch("assets/js/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});