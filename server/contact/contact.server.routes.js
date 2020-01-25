'use strict';

module.exports = function (app) {
    var contact = require('./contact.server.controller');

    app.route('/api/contact').post(contact.sendContactRequest);
};