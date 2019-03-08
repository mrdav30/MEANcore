'use strict';

module.exports = function (app) {
    var ctrl = require('./logger.server.controller');
    app.route('/api/log-error').post(ctrl.logError);
};
