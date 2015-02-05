/* jshint node: true, strict: true */

"use strict";


var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer');



// Minify JS

gulp.task('js', function() {
    return browserify('./src/js/script.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('./public/js/'));
});



// Minify CSS

gulp.task('css-fold', function() {
    return gulp.src(['src/css/structure.css'])
        .pipe(minifyCSS({removeEmpty : true}))
        .pipe(concat('structure.css'))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('css-app', function() {
    return gulp.src(['src/css/styles.css'])
        .pipe(minifyCSS({removeEmpty : true}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./public/css/'));
});



// Copy images

gulp.task('img', function() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./public/img/'));
});



// Copy favicon

gulp.task('icon', function() {
    return gulp.src('./src/favicon.ico')
        .pipe(gulp.dest('./public'));
});


// Copy fonts

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./public/fonts/'));
});



// The default task

gulp.task('default', ['js', 'css-fold', 'css-app', 'img', 'fonts', 'icon']);
