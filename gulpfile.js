// npm install -g gulp
// npm install gulp gulp-load-plugins gulp-rename gulp-concat gulp-sass gulp-autoprefixer gulp-jshint gulp-uglify gulp-csso gulp-task-listing --save-dev
// npm install browser-sync --save-dev


var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;



gulp.task('js', function() {
    return gulp.src('static/src/js/*.js')
        .pipe(plugins.changed('static/src/js/*.js'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        // .pipe(plugins.obfuscate())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('static/dist/js/'));
});

gulp.task('js-watch', ['js'], reload);

gulp.task('servejs', ['js'], function() {

    browserSync.init({
        proxy: "localhost:8000",
        browser: 'google chrome'
    });

    gulp.watch("static/src/js/*.js", ['js-watch']);
    gulp.watch("*.html").on('change', reload);
});







gulp.task('css', function() {
    return gulp.src('static/src/css/*.scss')
        .pipe(plugins.changed('static/src/css/*.scss'))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sass())
        .pipe(plugins.csso())
        .pipe(gulp.dest('static/dist/css/'))
        .pipe(reload({
            stream: true
        }));
});




gulp.task('serve', ['css'], function() {

    browserSync.init({
        proxy: "localhost:8000",
        browser: 'google chrome'
    });

    gulp.watch("static/src/css/*.scss", ['css']);
    gulp.watch("templates/**/*.html").on('change', reload);

});









// task concat JavaScript
gulp.task('cjs', function() {
    return gulp.src(['static/dist/js/a.js', 'static/dist/js/b.js'])
        .pipe(plugins.concat('ab.js'))
        .pipe(gulp.dest('static/dist/js/concat/'))
})


// console all tasks
gulp.task('help', plugins.taskListing);




// default task   
gulp.task('default', function() {
    gulp.run('cssbsbase', 'css', 'js');

    gulp.watch('static/src/js/*.js', function() {
        gulp.run('js');
    });

    gulp.watch('static/src/css/*.scss', function() {
        gulp.run('css');
    });
});


// $gulp
// ——  default

// $gulp serve
// —— 监听并自动化 CSS

// $gulp servejs
// —— 监听并自动化 js

// $gulp css
// —— 自动化 css

// $gulp js
// —— 自动化 js

// $gulp help
// —— 查看所有任务
