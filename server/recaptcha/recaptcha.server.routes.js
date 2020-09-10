import * as recaptcha from './recaptcha.server.controller.js';

export default function (app) {
  // Recaptcha Routes

  // Setting up the users profile api
  app.route('/api/validate_captcha').get(recaptcha.getRecaptchaValdiation);
}
