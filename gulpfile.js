var gulp = require('gulp'),
		jade = require('gulp-jade'),
		sass = require('gulp-sass'),
		webserver = require('gulp-webserver');

var paths = {
	sass: ["./app/assets/css/*.scss", "./app/assets/css/pages/*.scss"],
	jade: "./app/*.jade",
	img: ["./app/assets/img/*.jpg", "./app/assets/img/*.gif", "./app/assets/img/*.png"]
}

gulp.task('img', function(){
	return gulp.src(paths.img)
    .pipe(gulp.dest('./dist/assets/img'));
})

gulp.task('jade', function(){
	return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./dist/'));
})

gulp.task('sass', function(){
	return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/assets/css'));
})

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true,
      directoryListing: false
    }));
});

gulp.task('watch', function(){
	gulp.watch(paths.jade, ['jade'])
	gulp.watch('./app/partials/*.jade', ['jade'])
	gulp.watch(paths.sass, ['sass'])
	gulp.watch(paths.img, ['img'])
})

gulp.task('default', ['img', 'sass', 'jade', 'webserver', 'watch'])
