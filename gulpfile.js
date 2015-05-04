/**
 * Created by dpavao on 4/28/15.
 */
var gulp = require('gulp');
var conf = require('./gulp.conf');
var $ = require('gulp-load-plugins')({lazy: true});


var tsProject = $.typescript.createProject({
    declarationFiles: true,
    noExternalResolve: true,
    typescript: require('typescript'),
    sourceRoot: '/app/',
    target: 'ES6'
});


/**
 * Compilation / Copying Tasks
 */
gulp.task('typescript', function () {
    var tsResult = gulp.src(conf.src.ts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('./', {
            debug: true,
            includeContent: false,
            sourceMappingURLPrefix: '.'
        }))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('scss', function () {
    return gulp.src(conf.src.scss)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('copy-html', function () {

    return gulp.src(conf.src.html)
        .pipe(gulp.dest('.tmp/'));
});


/**
 * Watcher Tasks
 */
gulp.task('typescript-watcher', function () {
    return $.watch(conf.src.ts, function () {
        gulp.start('typescript');
    });
});

gulp.task('scss-watcher', function () {
    return $.watch('app/scss/**/*.scss', function () {
        gulp.start('scss');
    });
});

gulp.task('html-watcher', function () {
    return $.watch(conf.src.html, function () {
        gulp.start('copy-html');
    });
});


/**
 * Main Tasks
 */
gulp.task('watch', [
    'typescript-watcher',
    'html-watcher',
    'scss-watcher'
]);

gulp.task('dev', [
    'typescript',
    'copy-html',
    'scss',
    'watch'
]);