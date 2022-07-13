const gulp = require("gulp");
const { src, series, parallel, dest, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const sourceMaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass")(require("sass"));
const cache = require("gulp-cache");
const webp = require("gulp-webp");
const imageminWebp = require("imagemin-webp");
const clone = require("gulp-clone");
const clonesink = clone.sink();
const config = {
    paths: {
        src: {
            html: "src/index.html",
            allSCSS: "src/sass/**/*.scss",
            scss: "src/sass/main.scss",
            js: "src/scripts/*.js",
            img: "src/img/*.+(png|jpg|jpeg|svg)",
        },
        dist: {
            html: "dist/",
            devCSS: "src/",
            prodCSS: "dist/",
            js: "dist/",
            img: "dist/img/",
        },
    },
};

// HTML MINIFY TASK
function htmlMinify() {
    return src(config.paths.src.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest(config.paths.dist.html))
        .pipe(browserSync.stream());
}

// SCSS COMPILE TASK
function compileSCSS() {
    return src(config.paths.src.scss)
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write("."))
        .pipe(dest(config.paths.dist.devCSS))
        .pipe(browserSync.stream());
}

// CSS BUILD TASK
function buildCSS() {
    return src(config.paths.src.scss)
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(sourceMaps.init())
        .pipe(concat("main.min.css"))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourceMaps.write("."))
        .pipe(dest(config.paths.dist.prodCSS));
}

// JAVASCRIPT BUNDLER
function bundleJS() {
    return src(config.paths.src.js)
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(sourceMaps.init())
        .pipe(concat("index.min.js"))
        .pipe(uglify())
        .pipe(sourceMaps.write("."))
        .pipe(dest(config.paths.dist.js))
        .pipe(browserSync.stream());
}

//IMAGE OPTIMIZATION TASK
function imageOptimizer() {
    return src(config.paths.src.img)
        .pipe(cache(imagemin()))
        .pipe(clonesink)
        .pipe(webp())
        .pipe(clonesink.tap())
        .pipe(gulp.dest(config.paths.dist.img));
}

// START SERVER
function localServer() {
    browserSync.init({
        server: {
            baseDir: "dist/",
        },
        browser: "Google Chrome",
    });
}

// CLEAR CACHE TASK
function clearCache() {
    return cache.clearAll();
}

// WATCH TASKS
watch(config.paths.src.html, htmlMinify);
watch(config.paths.src.allSCSS, parallel(compileSCSS, buildCSS));
watch(config.paths.src.js, bundleJS);
watch(config.paths.src.img, imageOptimizer);

function watchTask() {
    watch(
        [config.paths.src.html, config.paths.src.allSCSS, config.paths.src.img],
        htmlMinify,
        compileSCSS,
        buildCSS,
        bundleJS,
        imageOptimizer
    );
}

// GULP EXPORTS
exports.htmlMinify = htmlMinify;
exports.compileSCSS = compileSCSS;
exports.buildCSS = buildCSS;
exports.bundleJS = bundleJS;
exports.imageOptimizer = imageOptimizer;
exports.localServer = localServer;
exports.clearCache = clearCache;
exports.watchTask = watchTask;
exports.default = series(
    parallel(htmlMinify, compileSCSS, buildCSS, bundleJS, imageOptimizer),
    clearCache,
    localServer,
    watchTask
);
