import config  from '../../config/config.js';

export function sendContactRequest (req, res) {
  // email data and options
  const mailOptions = {
    to: config.mailer.from,
    replyTo: req.body.email,
    subject: 'Contact : ' + req.body.email + ' : ' + req.body.subject,
    emailHTML: req.body.message
  };

  config.services.sendEmail(req, res, mailOptions, function (err) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send({
      message: "Message sent!"
    });
  });
}
