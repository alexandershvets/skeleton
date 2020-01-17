let syntax = 'sass'; // SASS or SCSS

const gulp	= require('gulp'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	cleanCss = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	gulpif = require('gulp-if'),
	gcmq = require('gulp-group-css-media-queries'),
	terser = require('gulp-terser'),
	imagemin = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	imageminPngquant = require('imagemin-pngquant'),
	newer = require('gulp-newer'),
	cache = require('gulp-cache'),
	rSync = require('gulp-rsync'),
	fileinclude = require('gulp-file-include'),
	sass = require('gulp-sass'),
	notify = require("gulp-notify"),
	changed = require('gulp-changed'),
	debug = require('gulp-debug'),
	favicon = require('gulp-favicons'),
	smartgrid = require('smart-grid');


/* Development Variables */
const isDev = process.argv.includes('--dev'); // включает sourcemap; отключает cleanCss, uglify
const isProd = !isDev; // включает в работу плагины: cleanCss, uglify; отключает sourcemap
const isSync = process.argv.includes('--sync'); // включает browser-sync
console.log(isDev);
console.log(isProd);
console.log(isSync);


/* Paths */
let paths = {
	views: {
		src: [
			'./app/views/index.html',
			'./app/views/pages/*.html',
			'./app/views/ht.access'
		],
		dist: './dist/',
		watch: './app/views/**/*.html'
	},
	styles: {
		src: './app/'+syntax+'/**/*.'+syntax+'',
		dist: './dist/css/',
		watch: './app/'+syntax+'/**/*.'+syntax+''
	},
	scripts: {
		src: [
			'./node_modules/jquery/dist/jquery.min.js',
			// './node_modules/slick-carousel/slick/slick.min.js', // npm i slick-carousel
			// './app/js/lazy.js', // Lazy Load, раскоментировать при необходимости отложенной загрузки изображений
			'./app/js/common.js' // всегда в конце
		],
		dist: './dist/js',
		watch: [
			'./app/js/**/*.js',
			'./app/libs/**/*.js'
		]
	},
	images: {
		src: [
			'./app/img/**/*.{jpg,jpeg,png,gif,tiff,svg}',
			'!./app/img/favicon/*.{jpg,jpeg,png,gif,tiff,svg}'
		],
		dist: './dist/img/',
		watch: './app/img/**/*'
	},
	fonts: {
		src: "./app/fonts/**/*",
		dist: "./dist/fonts/",
		watch: "./src/fonts/**/*"
	},
	favicons: {
		src: "./app/img/favicon/*.{jpg,jpeg,png,gif}",
		dist: "./dist/img/favicons/",
	},
	smartgrid: {
		dist: './app/'+syntax+'/',
		watch: './gulpfile.smart-grid.js'
	}
};


/* Functions */

// Clear
function clear() {
	return del('dist');
}

/* SmartGrid */
function grid(done) {
	delete require.cache[require.resolve(paths.smartgrid.watch)];
	let settings = require(paths.smartgrid.watch);
	smartgrid(paths.smartgrid.dist, settings);
	done();
}

// SASS / SCSS
function styles() {
	return gulp.src(paths.styles.src)
	.pipe(gulpif(isDev, sourcemaps.init()))
	.pipe(sass({
		includePaths: [__dirname + '/node_modules']
	}).on("error", notify.onError()))
	.pipe(concat('styles.min.css'))
	.pipe(gcmq()) // объединяет повторяющиеся медиазапросы
	.pipe(autoprefixer({
		grid: true, // добавить префиксы IE 10 - 11 для свойств Grid Layout
		overrideBrowserslist: ['last 10 versions'], // ['> 0.1%']
		cascade: false // убирает отступы у стилей, чтобы не было "лесенки"
	}))
	.pipe(gulpif(isProd, cleanCss({
		compatibility: "ie8", // контролирует используемый режим совместимости, по умолчанию ie10+
			level: {
				1: {
					specialComments: 0, // обозначает число / *! ... * / комментарии сохранены; по умолчанию `all`
					removeEmpty: true, // удаление пустых правил и вложенных блоков; по умолчанию `true`
					removeWhitespace: true // удаление неиспользуемых пробелов; по умолчанию `true`
				},
				2: {
					mergeMedia: true, // контролирует слияние `@ media`; по умолчанию true 
					removeEmpty: true,
					removeDuplicateFontRules: true, // управляет сокращением несмежных правил; по умолчанию true
					removeDuplicateMediaBlocks: true, // удаление дубликатов `@ media`; по умолчанию true
					removeDuplicateRules: true, // удаление дублирующих правил; по умолчанию true
					removeUnusedAtRules: false // управление неиспользованными правилами; по умолчанию false
				}
			}
	})))
	.pipe(gulpif(isDev, sourcemaps.write()))
	.pipe(gulp.dest(paths.styles.dist))
	.pipe(debug({
		title: 'Processing CSS files:',
		showCount: false
	}))
	.pipe(gulpif(isSync, browserSync.stream()));
}

// Scripts & JS Libraries
function scripts() {
	return gulp.src(paths.scripts.src)
	.pipe(gulpif(isDev, sourcemaps.init()))
	.pipe(concat('scripts.min.js'))
	.pipe(gulpif(isProd, terser())) // минификация JS файла, с поддержкой ES6
	.pipe(gulpif(isDev, sourcemaps.write()))
	.pipe(gulp.dest(paths.scripts.dist))
	.pipe(debug({
		title: 'Processing JS files:',
		showCount: false
	}))
	.pipe(gulpif(isSync, browserSync.reload({ stream: true })));
}

// Optimized IMG GoogleSpeed
function img() {
	return gulp.src(paths.images.src)
	.pipe(newer('./dist/img'))
	.pipe(cache(imagemin([
		imageminJpegRecompress({
			progressive: true,
			min: 70, max: 75
		}),
		imageminPngquant({
			quality: [0.7, 0.75]
		}),
		imagemin.svgo({ // оптимизация SVG
			plugins: [
				{ removeViewBox: false }, // удалить viewBox атрибут, когда это возможно
				{ removeUnusedNS: false }, // удалить объявление неиспользуемых пространств имен
				{ removeUselessStrokeAndFill: false }, // удалить не используемые stroke и fill атрибуты
				{ cleanupIDs: false }, // удалить неиспользуемые и минимизировать использованные идентификаторы
				{ removeComments: true }, // удалить комментарии
				{ removeEmptyAttrs: true }, // удалить пустые атрибуты
				{ removeEmptyText: true }, // удалить пустые текстовые элементы
				{ collapseGroups: true } // свернуть бесполезные группы
			]
		})
	])))
	.pipe(gulp.dest(paths.images.dist))
	.pipe(debug({
		title: 'Processing IMG:',
		showCount: false
	}))
	.pipe(gulpif(isSync, browserSync.reload({ stream: true })));
}

// Clean IMG
function cleanimg() {
	return del('./dist/img/', { force: true });
}

// Favicons
function favicons() {
	return gulp.src(paths.favicons.src)
	.pipe(favicon({
		icons: { // `boolean` или `{ offset, background, mask, overlayGlow, overlayShadow }`
			appleIcon: true, // Создать иконки для Apple touch устройств
			favicons: true, // Создать иконку .ico
			online: false,
			appleStartup: false, // Создание загрузочных образов Apple
			android: false, // Создать иконку домашнего экрана Android
			firefox: false, // Создание иконок Firefox OS
			yandex: false, // Создать иконку браузера Yandex
			windows: false, // Создание иконок плитки Windows 8
			coast: false // Создать иконку Opera Coast
		}
	}))
	.pipe(gulp.dest(paths.favicons.dist))
	.pipe(debug({
		title: 'Processing Favicons:',
		showCount: false
	}));
}

// HTML
function html() {
	return gulp.src(paths.views.src)
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(changed(paths.views.dist, {hasChanged: changed.compareContents})) //компаратор
	.pipe(gulp.dest(paths.views.dist))
	.pipe(gulpif(isSync, browserSync.reload({ stream: true })));
}

// Fonts
function fonts() {
	return gulp.src(paths.fonts.src)
	.pipe(gulp.dest(paths.fonts.dist))
	.pipe(debug({
		title: 'Processing Fonts:',
		showCount: false
	}))
	.pipe(gulpif(isSync, browserSync.reload({ stream: true })));
}

// Deploy
function rsync() {
	return gulp.src('app/')
	.pipe(rSync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'],
		exclude: ['**/Thumbs.db', '**/*.DS_Store'],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
}

// Clean cache
function clean() {
	return cache.clearAll();
}

// Local Server
function watch() {
	if(isSync) { // Если isSyn = true, то brouser-sync будет работать, если fslse, то не будет.
		browserSync.init({
			server: {
				baseDir: "./dist" //отслеживаемый каталог
			},
			notify: false, // Отключить уведомления
			open: false, // Отключить автоматическое открытие localhost:3000
			// browser: ["chrome"], // В каком браузере открыть
			// online: false, // Работа в автономном режиме без подключения к Интернету
			// tunnel: "projectname", // Демонстрация страницы: http://projectname.localtunnel.me
			// tunnel: true, // Работает, как и предыдущяя опция, но присваивает рандомное имя.
			// host: "192.168.0.103" // IP сервера в локальной сети. Отключите, если у вас DHCP, пропишите под себя, если фиксированный IP в локалке.
		});
	}
	gulp.watch(paths.views.watch, html);
	gulp.watch(paths.styles.watch, styles);
	gulp.watch(paths.scripts.watch, scripts);
	gulp.watch(paths.images.watch, img);
	gulp.watch(paths.fonts.watch, fonts);
	gulp.watch(paths.smartgrid.watch, grid);
}

let build = gulp.series(clear,
	gulp.parallel(styles, html, scripts, img, fonts, favicons)
);

/* Tasks Registaration*/
exports.grid = grid; // Сгенерировать сетку SmartGrid
exports.html = html; // Собрать html-файлы
exports.styles = styles; // Скомпилировать SASS/SCSS-файлы
exports.scripts = scripts; // Собрать JS-файлы
exports.img = img; // Импорт графики
exports.cleanimg = cleanimg; // Очистка папки img
exports.fav = favicons; // Генерация фавикон иконок
exports.clear = clear; // Очистка папки dist
exports.rsync = rsync; // Деплой
exports.cache = clean; // Очиcтить кеш
exports.fonts = fonts; // Импорт шрифтов
exports.build = gulp.series(grid, build); // Импорт файлов на продакшен
exports.watch = gulp.series(build, watch);