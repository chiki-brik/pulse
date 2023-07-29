const gulp = require('gulp'); //можно взять с сайта https://browsersync.io/ из документации -> подключение пакета gulp
const browserSync = require('browser-sync'); //можно взять с сайта https://browsersync.io/ из документации -> подключение пакета browserSync
const sass = require('gulp-sass')(require('sass')); // можно взять с сайта https://www.npmjs.com/package/gulp-sass
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");

gulp.task('server', function() { //server - название задачи
    browserSync({ 
        server: {
            baseDir: "src" // откуда будет запускаться сервер. В этой папке будет искаться файл index.html и запускаться
        }
    });
    gulp.watch("src/*.html").on('change', browserSync.reload); // обновление страницы при изменении html-файла
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)") // --убрать /**/
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // какое действие будет выполняться с файлом из return. Компиляция всего sass-кода. error - будет подсказывать, где ошибка, если что-то пойдет не так
    .pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("src/css")) // куда нужно переместить файл-результат
    .pipe(browserSync.stream()); // обновление страницы
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles')); // при обновлении sass\scss файлов будет запускаться задача style, которая эти файлы будет компилировать и обновлять странцу
})

gulp.task('default', gulp.parallel('watch', 'server', 'styles')); // задача, которая запускается всегда по-умолчанию. Обязательное имя default. Она будет запускать все нужные нам задачи