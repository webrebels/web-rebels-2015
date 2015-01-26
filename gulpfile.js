/* jshint node: true, strict: true */

"use strict";


var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css');



// Minify JS

gulp.task('js', function() {
    return gulp.src(['src/js/script.js'])
        .pipe(uglify({outSourceMap: false}))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./public/js/'));
});



// Minify CSS

gulp.task('css', function() {
    return gulp.src(['src/css/styles.css'])
        .pipe(minifyCSS({removeEmpty : true}))
        .pipe(concat('styles.css'))
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

gulp.task('default', ['js', 'css', 'img', 'fonts', 'icon']);
