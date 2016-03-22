var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');

//compress jquery plugin source code and put it into corresponding folders
gulp.task('compress-scripts', function(){
	return gulp.src(['src/jquery.previewer.js'])
			   .pipe(gulp.dest('dest'))
			   .pipe(uglify({preserveComments: 'license'}))
			   .pipe(rename({
			   		suffix: '.min', 
			   		extname: '.js'
			   	}))
			   .pipe(gulp.dest('dest'))
			   .pipe(gulp.dest('public/js'))
			   .pipe(notify({message: 'compress-scripts completed!'}));
});

//lint script
gulp.task('lint', function(){
	return gulp.src('src/jquery.previewer.js')
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'));
});

gulp.task('default', ['compress-scripts']);