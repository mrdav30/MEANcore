'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  server: {
    /* ServerJs */
    allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
    routes: ['server/!(core)/**/*routes.js', 'server/core/**/*routes.js'],
    sockets: 'server/**/*sockets.js',
    models: 'server/**/*model.js',
    config: ['server/*/config/*.js'],
    views: ['server/*/views/*.html']
  }
};