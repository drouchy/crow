var gulp      = require('gulp');
var gutil     = require('gulp-util');
var connect   = require('gulp-connect');
var gulpif    = require('gulp-if');
var coffee    = require('gulp-coffee');
var concat    = require('gulp-concat');
var tplCache  = require('gulp-angular-templatecache');
var jade      = require('gulp-jade');
var less      = require('gulp-less');
var karma     = require('gulp-karma');

gulp.task('appJS', function() {
  gulp.src(['./js_app/scripts/**/*.js','./js_app/scripts/**/*.coffee'])
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true}).on('error', gutil.log)))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./priv/static/scripts'))
});

gulp.task('test', function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/underscore/underscore.js',
      'bower_components/momentjs/moment.js',
      'web/app/scripts/**/*.coffee',
      'priv/static/scripts/templates.js',
      'test/web/support/**/*.coffee',
      'test/web/mock/**/*.coffee',
      'test/web/spec/**/*.coffee'
    ])
    .pipe(karma({
      configFile: 'test/web/karma.conf.coffee',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('templates', function() {
  gulp.src(['./js_app/views/**/*.jade'])
    .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
    .pipe(tplCache('templates.js',{standalone:false, root: '/views', module: 'reInspectorWebApp'}))
    .pipe(gulp.dest('./priv/static/scripts'))
});

gulp.task('libCSS', function() {
  gulp.src([
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/bootstrap/dist/css/bootstrap-theme.css',
      './bower_components/font-awesome/css/font-awesome.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./priv/static/styles'))
});

gulp.task('fonts', function() {
    gulp.src([
      'bower_components/font-awesome/fonts/fontawesome-webfont.*',
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.*'
    ])
    .pipe(gulp.dest('./priv/static/fonts'));
});

gulp.task('appCSS', function() {
  gulp
    .src('./web/app/styles/**/*.less')
    .pipe(less())
    .pipe(concat('application.css'))
    .pipe(gulp.dest('./priv/static/styles'))
});

gulp.task('libJS', function() {
  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/json3/lib/json3.js',
    'bower_components/underscore/underscore.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/momentjs/moment.js'
    ]).pipe(concat('vendor.js'))
      .pipe(gulp.dest('./priv/static/scripts'));
});

gulp.task('index', function() {
  gulp.src(['./app/index.jade', './app/index.html'])
    .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch',function() {

  // reload connect server on built file change
  gulp.watch([
      'build/**/*.html',
      'build/**/*.js',
      'build/**/*.css'
  ], function(event) {
      return gulp.src(event.path)
          .pipe(connect.reload());
  });

  // watch files to build
  gulp.watch(['./js_app/scripts/**/*.coffee'], ['appJS', 'test']);
  gulp.watch(['./test/web/**/*_test.coffee'],   ['test']);
  gulp.watch(['./js_app/views/**/*.jade'],     ['templates']);
  gulp.watch(['./js_app/styles/**/*.less'],    ['appCSS']);
});

gulp.task('default', ['appJS', 'templates', 'appCSS', 'libCSS', 'fonts', 'index', 'libJS', 'libCSS']);
