'use strict';

module.exports = function (app) {
    var ctrl = require('./logger.server.controller');
    app.route('/api/logError').post(ctrl.logError);
};
