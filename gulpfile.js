var gulp = require('gulp')
    , data = require('gulp-data')
    , sass = require('gulp-sass')
    , sourcemaps = require('gulp-sourcemaps')
    , minifyCss = require('gulp-minify-css')
    , rename = require("gulp-rename")
    , minify = require("gulp-minify")
    , browserSync = require('browser-sync').create()
    , reload = browserSync.reload
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , wait = require('gulp-wait');


function swallowError(error) {
    // details of the error in the console 
    console.log(error.toString());
    this.emit('end');
}

// Static Server + watching scss/html files 
gulp.task('serve', function () {

    gulp.start('sass');
    gulp.start('js');
    gulp.start('partials');
    gulp.start('pages');
    gulp.start('html');
    //    gulp.start('export');

    browserSync.init({
        server: "./app/"
    });


    gulp.watch("source/scss/**/*.scss", ['sass']).on('change', reload);
    gulp.watch("source/html/partials/**/*.html", ['partials']).on('change', reload);
    gulp.watch("source/html/pages/*.html", ['pages']).on('change', reload);
    gulp.watch("source/html/**/*.html", ['html']).on('change', reload);
    gulp.watch("source/js/**/*.js", ['js']).on('change', reload);
    console.log('watching all');

});

//for HTML build from source to app

gulp.task('partials', function () {
    return gulp.src('source/html/partials/**/*.html')
        .pipe(gulp.dest('app/partials/'));
});

gulp.task('pages', function () {
    return gulp.src('source/html/pages/*.html')
        .pipe(gulp.dest('app/pages/'));
});

gulp.task('html', function () {
    return gulp.src('source/html/index.html')
        // output files in app folder
        .pipe(gulp.dest('app/'))
        .pipe(browserSync.stream());
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src('source/scss/styles.scss')
        //.pipe(sourcemaps.init()) 
        .pipe(sass().on('error', sass.logError))
        //.pipe(sourcemaps.write("app/maps/"))
        .pipe(gulp.dest('source/css/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('app/css/'));


});


// for Concatenation and minification of js files
gulp.task('js', function () {
    return gulp.src('source/js/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('source/js/main/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/js/'));

});

//for Exporting the source to the vendor folder

//gulp.task('export', function () {
//    return gulp.src('app/**/*.*')
//        .pipe(gulp.dest(''));
//});

gulp.task('default', ['serve']);