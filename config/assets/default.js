export const submodules = {
  basePath: ['modules/!(core)']
}
export const server = {
  /* ServerJs */
  allJS: ['server.js', 'config/**/*.js', 'modules/**/server/**/*.js'],
  routes: ['modules/**/server/!(core)/**/*routes.js', 'modules/core/server/core/**/*routes.js'],
  sockets: 'modules/**/server/**/*sockets.js',
  models: 'modules/**/server/**/*model.js',
  config: ['modules/**/server/**/config/*.js'],
  services: ['modules/**/server/services/*.js'],
  helpers: ['modules/**/server/helpers/*.js'],
  sharedModules: ['shared_modules/*.js'],
  views: ['modules/**/server/**/views/*.html']
};
