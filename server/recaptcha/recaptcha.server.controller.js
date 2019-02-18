var rp = require('request-promise'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

const secretKey = config.RECAPTCHA_SECRET_KEY;
const scope = 'https://www.google.com/recaptcha/api/siteverify';

exports.getRecaptchaValdiation = function (req, res) {
    const options = {
        method: 'POST',
        uri: scope,
        qs: {
            secret: secretKey,
            response: req.query.token
        },
        json: true
    };

    rp(options)
        .then(response => res.json(response))
        .catch(() => {});
}