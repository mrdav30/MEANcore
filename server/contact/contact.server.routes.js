import * as contact from './contact.server.controller.js';

export default function (app) {
    app.route('/api/contact').post(contact.sendContactRequest);
}