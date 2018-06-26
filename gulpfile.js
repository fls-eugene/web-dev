'use strict';

/******************************************************************
 Configuration will be loaded via JSON
******************************************************************/

var config = {

    // which server to use
    useproxy: false,

    // Local development server
    proxyserver:
    {
        proxy: '0.0.0.0',
    },

    localserver:
    {
        server:
        {
            baseDir: "./build"
        }
    },

    // Paths to important folders
    paths:
    {
        build: './build',
        build_css: '/css',
        source: './source',
    },
    // Main sass file
    sass_file: './source/css/style.scss',

    // Log messages on file changes
    enable_log: false,
    enable_log_all: false,

    // Additional files to monitor and copy
    files: [
        'style.css',
        'screenshot.png',
        '**/*.php'
    ],
    // Supported browsers for autoprefixer
    browsers: [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ],
};

/******************************************************************
  End of Configuration
******************************************************************/

// Require libraries

var fs = require('fs');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var wait = require('gulp-wait');

gulp.task('clean', done =>
{
    clean();
    done();
});

gulp.task('default', (done) =>
{
    if (!init())
    {
        done();
        return;
    }

    if (config.enable_log_all)
        notify_changes();

    clean();
    process_html();
    process_css();
    process_js();

    var files = config.files;
    for (var i = 0; i < files.length; i++)
        process_files(config.paths.source + '/' + files[i]);

    console.log('Rebuild completed');

    gulp.watch(config.paths.source + '/**/*.html')
        .on('all', (e, x) => process_html(x));

    gulp.watch(config.paths.source + '/**/*.scss')
        .on('all', (e, x) => process_css()); // Only process main .scss, as it will import the changes

    gulp.watch(config.paths.source + '/**/*.js')
        .on('all', (e, x) => process_js(x));

    for (var i = 0; i < files.length; i++)
        gulp.watch(config.paths.source + '/' + files[i])
        .on('all', (e, x) => process_files(x));

    if (config.useproxy)
        browserSync.init(config.proxyserver);
    else
        browserSync.init(config.localserver);

});

/**
 * Simply copying the files to the Build path
 * @param {string} src Files to process
 * @param {string} dest Path to process to
 * @param {int} wait_ms Time to wait in ms
 */
function process_files(src, dest = config.paths.build, wait_ms = 500)
{
    src = src.replace('\\', '/');
    dest = dest.replace('\\', '/');

    notify("Extra Files", src, dest);

    return gulp.src(src, { allowEmpty: true })
        .pipe(wait(wait_ms))
        .pipe(gulp.dest(dest))
        .pipe(reload({ stream: true }));
}

/** 
 * Process .sass to .css
 * @param {string} src Files to process
 * @param {string} dest Path to process to
 * @param {int} wait_ms Time to wait in ms
 */
function process_css(src = config.sass_file, dest = config.paths.build + config.paths.build_css, wait_ms = 500)
{
    src = src.replace('\\', '/');
    dest = dest.replace('\\', '/');

    notify("CSS", src, dest);

    return gulp.src(src, { allowEmpty: true })
        .pipe(wait(wait_ms))
        .pipe(sass(
        {
            outputStyle: 'nested',
            includePaths: ['.'],
        }).on('error', err => console.log(err.message)))
        .pipe(autoprefixer({ browsers: config.browsers }))
        .pipe(csso()) // Minify the file
        .pipe(gulp.dest(dest))
        .pipe(reload({ stream: true }));
}

/**
 * Uglify .js 
 * @param {string} src Files to process
 * @param {string} dest Path to process to
 * @param {int} wait_ms Time to wait in ms
 */
function process_js(src = config.paths.source + '/**/*.js', dest = config.paths.build, wait_ms = 500)
{
    src = src.replace('\\', '/');
    dest = dest.replace('\\', '/');

    notify("JavaScript", src, dest);

    return gulp.src(src, { allowEmpty: true })
        .pipe(wait(wait_ms))
        //.pipe(uglify().on('error', err => console.log(err.message)))
        .pipe(gulp.dest(dest))
        .pipe(reload({ stream: true }));
}

/**
 * Minimize .html 
 * @param {string} src Files to process
 * @param {string} dest Path to process to
 * @param {int} wait_ms Time to wait in ms
 */
function process_html(src = config.paths.source + '/**/*.html', dest = config.paths.build, wait_ms = 500)
{
    src = src.replace('\\', '/');
    dest = dest.replace('\\', '/');

    notify("Html", src, dest);

    return gulp.src(src, { allowEmpty: true })
        .pipe(wait(wait_ms))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }).on('error', err => console.log(err.message)))
        .pipe(gulp.dest(dest))
        .pipe(reload({ stream: true }));
}

// Other Utility Functions
function clean() { del([config.paths.build] + '/*', { force: true }); }

/** 
 * Simple console log notifications 
 */
function notify_changes(src = config.paths.source + '/**/*.*')
{
    src = src.replace('\\', '/');

    var log = console.log.bind(console);
    var watcher = gulp.watch(src);
    watcher
        .on('add', path => log(`-- File added: ${path}`))
        .on('change', path => log(`-- File changed: ${path}`))
        .on('unlink', path => log(`-- File removed: ${path}`));
    watcher
        .on('addDir', path => log(`-- Directory added: ${path}`))
        .on('unlinkDir', path => log(`-- Directory removed: ${path} `))
        .on('error', error => log(`-- Watcher error: ${error}`))
        .on('ready', () => log('Initial scan complete. Ready for changes'));
    //.on('raw', (event, path, details) => log('Raw event info:', event, path, details));
    return watcher;
}

function notify(group, src, dest)
{
    if (config.enable_log)
    {
        console.group(group);
        console.log(src);
        console.log(dest);
        console.groupEnd();
    }
}

// JSON Config

function init()
{
    console.clear();

    var file = 'gulpconfig.json';
    if (!fs.existsSync(file))
    {
        fs.writeFileSync(file, JSON.stringify(config, null, 2));

        console.log(`WARNING. New config file was created: ${file}`);
        console.log('Either make changes to the new config file, or run gulp again');

        return false;
    }
    else
    {
        try
        {
            var json = fs.readFileSync(file);
            config = JSON.parse(json);

            if (!config.paths.build || config.paths.build.length == 0)
                throw new Error('Build path cannot be empty');

            console.log('--------------------------------------------');
            console.log('Source Directory: ' + config.paths.build);
            console.log('Build Directory: ' + config.paths.source);
            console.log('--------------------------------------------');
        }
        catch (err)
        {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('ERROR READING: ' + file);
            console.log('EITHER DELETE THE FILE TO GENERATE A NEW FILE');
            console.log('OR MANUALLY FIX THE JSON ERROR');
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log();
            console.log("Message: " + err.message);
            console.log();

            return;
        }
    }

    return true;
}