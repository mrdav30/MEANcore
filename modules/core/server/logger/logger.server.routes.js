import * as logger from './logger.server.controller.js';

export default (app) => {
  app.route('/api/log-error').post(logger.logError);
}
