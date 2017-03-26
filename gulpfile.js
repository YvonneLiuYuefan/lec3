var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// in terminal "gulp sass"
// gulp.task('sass', function () {
//     return gulp.src('./react-client/css/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('./react-client/css'))
// });

gulp.task('sass', function () {
    return gulp.src('./react-client/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./react-client/css'))
        .pipe(browserSync.stream())
});

gulp.task('default', function () {
    browserSync.init({
        proxy: "localhost:8080"
    });
    gulp.watch('./react-client/css/*.scss', ['sass']);
    gulp.watch('./react-client/*.html').on('change', browserSync.reload);
});

// gulp.task('browser-sync', function () {
//     browserSync.init({
//         proxy: "localhost: 8080"
//     });
//     gulp.watch('./react-client/css/*.scss', ['sass']);
// })

// in terminal "gulp sass"
// gulp.task('default', function () {
//     gulp.watch('./react-client/css/*.scss', ['sass'])
// //    watch for changes and run sass defined above
// })

// gulp.task('sass:watch', function () {
//     gulp.watch('./react-client/css/*.scss', ['sass'])
// //    watch for changes and run sass defined above
// })