/* eslint comma-dangle:[0, "only-multiline"] */

export const server = {
  /* ServerJs */
  allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
  routes: ['server/!(core)/**/*routes.js', 'server/core/**/*routes.js'],
  sockets: 'server/**/*sockets.js',
  models: 'server/**/*model.js',
  config: ['server/*/config/*.js'],
  services: ['server/services/*.js'],
  helpers: ['server/helpers/*.js'],
  sharedModules: ['sharedModules/*.js'],
  views: ['server/*/views/*.html']
};