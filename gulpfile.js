const gulp = require('gulp'); //можно взять с сайта https://browsersync.io/ из документации -> подключение пакета gulp
const browserSync = require('browser-sync'); //можно взять с сайта https://browsersync.io/ из документации -> подключение пакета browserSync
const sass = require('gulp-sass')(require('sass')); // можно взять с сайта https://www.npmjs.com/package/gulp-sass
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() { //server - название задачи
    browserSync({ 
        server: {
            baseDir: "dist" //"src" // откуда будет запускаться сервер. В этой папке будет искаться файл index.html и запускаться
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
    //.pipe(gulp.dest("src/css")) // куда нужно переместить файл-результат
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream()); // обновление страницы
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles')); // при обновлении sass\scss файлов будет запускаться задача style, которая эти файлы будет компилировать и обновлять странцу
    gulp.watch("src/*.html").on('change', gulp.parallel('html')); // при обновлении html-файла запускаем задачу по его минимизации и перенесению в папку dist
});

gulp.task('html', function() { // минимизация html-кода и перемещение в папку dist
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function() { // перемещение в папку dist всех скриптов
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"));
});

gulp.task('fonts', function() { // перемещение в папку dist всех шрифтов
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', function() { // перемещение в папку dist всех иконок
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"));
});

gulp.task('mailer', function() { // перемещение в папку dist расширения для отправки форм
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest("dist/mailer"));
});

gulp.task('images', function() { // перемещение в папку dist всех картинок
    return gulp.src("src/img/**/*")
        .pipe(imagemin())  //сжатие изображений
        .pipe(gulp.dest("dist/img"));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'html', 'mailer', 'images')); // задача, которая запускается всегда по-умолчанию. Обязательное имя default. Она будет запускать все нужные нам задачи