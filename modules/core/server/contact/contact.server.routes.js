import * as contact from './contact.server.controller.js';

export default (app) =>{
    app.route('/api/contact').post(contact.sendContactRequest);
}