'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  submodules: {
    appConfig: ['modules/*/config.js'],
    routes: ['server/**/*routes.js'], // path relative to module base dir
    sockets: ['server/**/*sockets.js'], // path relative to module base dir
    config: ['server/**/*config.js'], // path relative to module base dir
    views: ['server/**/*.html'] // path relative to module base dir
  },
  client: {
    touch: '../client/dist/touch'
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    /* ServerJs */
    allJS: ['server.js', 'config/**/*.js', 'app/**/*.js', 'modules/server/**/*.js'],
    routes: ['app/!(core)/*routes.js', 'app/core/**/*routes.js'],
    sockets: 'app/**/*sockets.js',
    models: 'app/**/*model.js',
    config: ['app/*/config/*.js'],
    views: ['app/*/views/*.html']
  }
};