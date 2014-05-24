var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var prefix = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var tsc = require('gulp-tsc');
var connect = require('gulp-connect');
var bowerFiles = require('gulp-bower-files');
var filter = require('gulp-filter');
var clean = require('gulp-clean');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

gulp.task('default', function (callback) {
    runSequence('clean', ['stylesheets', 'scripts', 'views', 'images', 'fonts', 'bower-components'], 'inject', ['connect', 'watchers']);
});

gulp.task('clean', function () {
    return gulp.src('devbuild', { read: false })
        .pipe(clean());
});

gulp.task('stylesheets', function () {
    return gulp.src('app/styles/**/*.less')
        .pipe(less())
        .pipe(prefix())
        .pipe(gulp.dest('devbuild/styles'));
});

gulp.task('scripts', function () {
    return merge(
        gulp.src('app/scripts/**/*.js').pipe(gulp.dest('devbuild/scripts')),
        gulp.src(['app/scripts/**/*.ts', '!app/scripts/definitions/**/*.ts'])
            .pipe(tsc())
            .pipe(gulp.dest('devbuild/scripts'))
    );
});

gulp.task('views', function () {
    return gulp.src('app/views/**/*')
        .pipe(gulp.dest('devbuild/views'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('devbuild/images'));
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('devbuild/fonts'));
});

gulp.task('bower-components', function () {
    return gulp.src('app/bower_components/**/*')
        .pipe(gulp.dest('devbuild/bower_components'));
});

gulp.task('inject', function () {
    return gulp.src('app/index.html')
        .pipe(inject(merge(
            gulp.src('devbuild/scripts/**/*.js', { read: false }),
            bowerFiles({ read: false })
                .pipe(filter([
                    '**/*.js',
                    '!**/angular-loader/**/angular-loader.js',
                    '!**/script.js/**/script.js',
                    '!**/bootstrap/**/bootstrap.js'
                ]))
            ), {
                starttag: '$script([',
                endtag: ']);',
                addRootSlash: false,
                ignorePath: ['app', 'devbuild'],
                transform: function (filepath, file, i, length) {
                    return '\'' + filepath + '\'' + (i + 1 < length ? ', ' : '');
                }
            }
        ))
        .pipe(inject(gulp.src('devbuild/styles/**/*.css', { read: false }), {
            addRootSlash: false,
            ignorePath: ['app', 'devbuild'],
        }))
        .pipe(gulp.dest('devbuild'));
});

gulp.task('connect', function (callback) {
    connect.server({
        root: 'devbuild',
        port: 9000,
        livereload: true
    });
    callback();
});

gulp.task('reload', function () {
    gulp.src('app/scripts/app.ts').pipe(connect.reload());
});

gulp.task('watchers', function (callback) {
    var scriptWatcher = gulp.watch(['app/**/*.{ts,js}', '!app/bower_components/**/*', '!app/scripts/definitions/**/*']);
    scriptWatcher.on('change', function (event) {
        console.log('Script ' + event.path + ' was ' + event.type + ', running script tasks...');
        runSequence('scripts', 'inject', 'reload');
    });

    var stylesheetWatcher = gulp.watch(['app/**/*.{css,less,sass,scss}', '!app/bower_components/**/*'], ['stylesheets', 'inject', 'reload']);
    stylesheetWatcher.on('change', function (event) {
        console.log('Stylesheet ' + event.path + ' was ' + event.type + ', running stylesheet tasks...');
        connect.reload();
    });

    var imageWatcher = gulp.watch(['app/**/*.{png,jpg,jpeg,gif,ico,svg}', '!app/bower_components/**/*'], ['images', 'reload']);
    imageWatcher.on('change', function (event) {
        console.log('Image ' + event.path + ' was ' + event.type + ', running image tasks...');
        connect.reload();
    });

    var fontWatcher = gulp.watch(['app/**/*.{woff,ttf,eot}', '!app/bower_components/**/*'], ['fonts', 'reload']);
    fontWatcher.on('change', function (event) {
        console.log('Font ' + event.path + ' was ' + event.type + ', running font tasks...');
        connect.reload();
    });

    var viewWatcher = gulp.watch(['app/**/*.{html,htm}', '!app/bower_components/**/*'], ['views', 'reload']);
    viewWatcher.on('change', function (event) {
        console.log('View ' + event.path + ' was ' + event.type + ', running view tasks...');
        connect.reload();
    });

    var bowerComponentWatcher = gulp.watch(['app/bower_components/**/*'], ['default']);
    bowerComponentWatcher.on('change', function (event) {
        console.log('Bower component ' + event.path + ' was ' + event.type + ', running default task...');
        connect.reload();
    });

    callback();
});

