var gulp = require('gulp');
var browserSync = require('browser-sync').create();


gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('default', function() {
    browserSync.init({
        server: "app/"
    });
    gulp.watch('app/*.html', gulp.parallel('html') );
    gulp.watch('app/*.css', gulp.parallel('html') );
    gulp.watch('app/main.js', gulp.parallel('html') )
});
