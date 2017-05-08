var path = require('path');
var gulp = require('gulp');
var del = require('del');
var bower = require('gulp-bower');
var clean = require('gulp-clean');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var cleanCSS = require('gulp-clean-css');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var historyFallback = require('connect-history-api-fallback');

var config = {
    app: './app',
    build: './proj',
};

config
    .src = {
        html: [config.app + '/**/*.html', config.app + '/**/*.php'],
        js: [config.app + '/assets/js/**/*.js'],
        lib: [config.app + '/assets/lib/**/*', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery-ui/jquery-ui.min.js', 'bower_components/angular/angular.min.js'],
        json: [config.app + '/json/**/*.json'],
        sass: [config.app + '/assets/scss/**/*.scss'],
        img: [config.app + '/assets/img/**/*'],
        fonts: [config.app + '/assets/fonts/*'],
        video: [config.app + '/assets/video/**/*']
    };

config
    .dest = {
        html: config.build + '',
        js: config.build + '/assets/js',
        lib: config.build + '/assets/lib',
        json: config.build + '/json',
        css: config.build + '/assets/css',
        img: config.build + '/assets/img',
        fonts: config.build + '/assets/fonts'
    };

gulp.task('bower', function() {
    return bower();
});

gulp.task('fonts', function() {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('img', function() {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('js', function() {
    return gulp.src(config.src.js)
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.cause);
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(uglify({
        	mangle: false
        }))
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('json', function() {
    return gulp.src(config.src.json)
        .pipe(gulp.dest(config.dest.json));
});

gulp.task('html', function() {
    return gulp.src(config.src.html)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(config.dest.html));
});

gulp.task('lib', function() {
    return gulp.src(config.src.lib)
        .pipe(gulp.dest(config.dest.lib));
});

gulp.task('usemin', function() {
    return gulp.src( config.app + '/index.html' )
        .pipe(usemin({
            libjs: [],
            appjs: []
        }))
        .pipe(gulp.dest(config.dest.html));
});

gulp.task('watch', function(){
    function checkDelete(file){
        if (file.event === 'unlink' || file.event === 'unlinkDir'){
            var srcPath = path.relative(path.resolve('.'), file.path);
            var destPath = path.resolve(config.build + '', srcPath);
            del.sync(destPath);
        }
    };

    var fontWatch = watch(config.src.fonts, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('fonts-watch');
    });

    var imgWatch = watch(config.src.img, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('images-watch');
    });

    var jsWatch = watch(config.src.js, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('js-watch');
    });

    var jsonWatch = watch(config.src.json, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('json-watch');
    });

    var sassWatch = watch(config.src.sass, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        if (file.event === 'unlink'){
            del.sync(config.dest.css + '/*');
        }
        gulp.start('sass');
    });

    var htmlWatch = watch(config.src.html, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('html-watch');
    });

    var libWatch = watch(config.src.lib, {events:['add', 'change', 'unlink', 'unlinkDir']}, function(file){
        checkDelete(file);
        gulp.start('lib-watch');
    });
});

gulp.task('sass', function(){
    return gulp.src(config.src.sass)
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(compass({
            css: config.dest.css,
            sass: config.app + '/assets/scss/',
            require: ['compass/import-once/activate']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
});

gulp.task('delete', function(){
    del.sync([
        config.build + '/*',
        '!' + config.build + '/services/',
        '!' + config.build + '/services/**'
    ]);
});

gulp.task('js-watch', ['js', 'usemin'], browserSync.reload);
gulp.task('json-watch', ['json'], browserSync.reload);
gulp.task('lib-watch', ['lib'], browserSync.reload);
gulp.task('images-watch', ['img'], browserSync.reload);
gulp.task('fonts-watch', ['fonts'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);

gulp.task('files', ['fonts', 'img', 'js', 'json', 'lib', 'usemin', 'sass', 'html']);

gulp.task('server', ['delete', 'files', 'bower', 'watch'], function() {
    browserSync.init({
        server: {
      		baseDir: config.build,
      		middleware: [
        		historyFallback()
      		]
    	}
    });
});

gulp.task('default', ['server']);
