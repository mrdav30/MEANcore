import got from 'got';
import config from '../../config/config.js';

const secretKey = config.RECAPTCHA_SECRET_KEY;
const scope = 'https://www.google.com/recaptcha/api/siteverify';

export function getRecaptchaValdiation (req, res) {
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
