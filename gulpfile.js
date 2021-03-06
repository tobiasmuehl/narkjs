'use strict'
const gulp   = require('gulp'),
	concat     = require('gulp-concat'),
	uglify     = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	del        = require('del'),
	jade       = require('gulp-jade'),
	spawn      = require('child_process').spawn,
	gutil      = require('gulp-util'),
	header     = require('gulp-header'),
	footer     = require('gulp-footer'),
	debug      = require('gulp-debug'),
	babel      = require('gulp-babel'),
	ngAnnotate = require('gulp-ng-annotate'),
	markdown   = require('gulp-markdown'),
	sass       = require('gulp-sass')

var server;
let mainTasks = ['html','other','scripts','css','serve']
let paths = {
	scripts:  ['logic/{,**/}!(*.spec.js)*.js'],
	server:   ['logic/{,**/}+(*.sjs|*.ijs)'],
	jade:     ['logic/{,**/}*.jade'],
	other:    ['logic/{,**/}!(*.md|*.js|*.ijs|*.sjs|*.jade|*.png|*.jpe?g|*.gif|*.scss)'],
	markdown: ['logic/{,**/}*.md'],
	sass:     ['logic/{,**/}*.scss']
}
gulp.task('clean', ()=> {
	// ensures port will not be taken up when you quit gulp
	if (typeof server !== 'undefined') { 
		try {
			require('child_process').execSync('kill -9 '+server.pid)
		} catch (e) {
			console.log(e)
		}
		}
		return del([__dirname+'/build'])
})
gulp.task('scripts', ['clean'], ()=> {
	return gulp
		.src(paths.scripts)
		.pipe(sourcemaps.init({
			loadMaps:true
		}))
		.pipe(ngAnnotate())
		.pipe(header('(function () {'))
		.pipe(footer('})();'))
		.pipe(babel({
			presets: ['babel-preset-es2015']
		}))
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(__dirname+'/build'))
})
gulp.task('html', ['clean'],()=> {
	gulp
		.src(paths.jade)
		.pipe(jade())
		.pipe(gulp.dest(__dirname+'/build'))
	gulp
		.src(paths.markdown)
		.pipe(markdown())
		.pipe(header('<div layout-padding>'))
		.pipe(footer('</div>'))
		.pipe(gulp.dest(__dirname+'/build'))
})
gulp.task('css', ['clean'],()=> {
		gulp
			.src(paths.sass)
			.pipe(sourcemaps.init({
				loadMaps:true
			}))
  	  .pipe(sass(
					{outputStyle:'compressed'}
				)
				.on('error', sass.logError)
			)
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write('./'))
  	  .pipe(gulp.dest(__dirname+'/build'));
})
gulp.task('other', ['clean'], ()=> {
	gulp
		.src(paths.other)
		.pipe(gulp.dest(__dirname+'/build'))
})
gulp.task('watch',()=> {
	gulp.watch(paths.scripts, mainTasks)
	gulp.watch(paths.jade	  , mainTasks)
	gulp.watch(paths.other	, mainTasks)
	gulp.watch(paths.server , mainTasks)
	gulp.watch(paths.sass   , mainTasks)
})

gulp.task('serve',['scripts','html','css','other'], ()=> {
	server = spawn('node', [__dirname+'/nark'], {env:process.ENV,stdio:'inherit'})
})
gulp.task('default', ['watch'].concat(mainTasks))
