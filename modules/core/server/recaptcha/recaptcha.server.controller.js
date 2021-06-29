import got from 'got';

export const getRecaptchaValdiation = (req, res) => {
  const config = req.app.locals.config;
  const secretKey = config.RECAPTCHA_SECRET_KEY;
  const scope = 'https://www.google.com/recaptcha/api/siteverify';
  const options = {
    qs: {
      secret: secretKey,
      response: req.query.token
    },
    json: true
  };

  got.post(scope, options)
    .then(response => res.json(response))
    .catch(() => {});
}
