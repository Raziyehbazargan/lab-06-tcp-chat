'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('test', function(){
  gulp.src('./test/*.js', {read:true})
  .pipe(mocha({reporter:'nyan'}));
});

gulp.task('eslint', function(){
  return gulp.src(['**/*.js','!node_modules/**'])  //everything with.js but not in node_modules folder
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('watch', function(){
  gulp.watch(['**/*.js','./test/*.js'],['eslint','test']); 
});

gulp.task('default',['watch']);