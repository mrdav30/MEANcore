'use strict';

module.exports = function (app) {
    var ctrl = require('./logger.server.controller');
    app.route('/logError').post(ctrl.logError);
};
