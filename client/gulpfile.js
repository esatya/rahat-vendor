/* eslint-disable */
let build = require('./build.json');
let config = require('../config/client.json')
const local = require('../config/local.json');
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const bs = require('browser-sync').create();
const fs = require('fs');

const checkIfProduction = () => {
  console.log(`######## Environment: [${process.env.ENV_TYPE}] ########`);
  return process.env.ENV_TYPE === 'production' || process.env.ENV_TYPE === 'prod';
};

const UpdateConfigFile = () => {
  const isDebugMode = !checkIfProduction();
  const rawdata = fs.readFileSync('../config/client.json');
  const config = JSON.parse(rawdata);

  if (isDebugMode != config.debugMode) {
    config.debugMode = isDebugMode;
    fs.writeFileSync('../config/client.json', JSON.stringify(config));
  }
};

UpdateConfigFile();

const buildVendors = () => {
  reloadConfig();
  return webpackStream({
    entry: build.vendors.entry,
    mode: 'none',
    optimization: {
      minimize: true,
    },
    output: {
      filename: build.vendors.outputFile,
    },
  }).pipe(gulp.dest(build.vendors.outputPath));
};

const buildJs = () => {
  const isProd = checkIfProduction();
  reloadConfig();
  return webpackStream({
    entry: build.js.entry,
    mode: 'none',
    optimization: {
      minimize: isProd,
    },
    output: {
      filename: '[name].js',
    },
  }).pipe(gulp.dest(build.js.outputPath));
};

const buildSelectedJs = (entry) => {
  return webpackStream({
    entry,
    mode: 'none',
    optimization: {
      minimize: false,
    },
    output: {
      filename: '[name].js',
    },
  }).pipe(gulp.dest(build.js.outputPath));
}

function watchFiles() {
  gulp.watch('./gulpfile.js', process.exit);
  gulp.watch('./build.json', gulp.series(buildVendors, buildJs));

  gulp.watch('./js/vendors/**/*', gulp.series(buildVendors));
  gulp.watch('./js/**/*').on('change', (file) => {
    reloadConfig();
    if (config.build)
      buildSelectedJs(config.build);
    else
      buildJs()
    bs.reload();
  })
  //gulp.watch('./js/**/*', gulp.series(buildJs, browserSyncReload))
  //gulp.watch(['../public/**/*'], gulp.series(browserSyncReload));
  gulp.watch(['../views/**/*'], gulp.series(browserSyncReload));
}

function browserSync(done) {
  reloadConfig();
  bs.init({
    proxy: local.app.url,
    port: 3000
    // server: {
    //   baseDir: "./",
    //   middleware: function(req, res, next) {
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    //     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    //     next();
    //   }
    // }
  });
  done();
}

function browserSyncReload(done) {
  bs.reload();
  done();
}

const reloadConfig = () => {
  build = JSON.parse(fs.readFileSync('./build.json', 'utf8'));
  config = JSON.parse(fs.readFileSync('../config/client.json', 'utf8'));
};

const buildAll = gulp.series(buildVendors, buildJs);
const watch = gulp.parallel(buildVendors, buildJs, watchFiles, browserSync);

exports.vendors = buildVendors;
exports.js = buildJs;
exports.build = buildAll;
exports.watch = watch;
exports.default = watch;
