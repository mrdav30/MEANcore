var path = require('path'),
  nodemailer = require('nodemailer'),
  async = require('async');

var createTestAccount = function (config, cb) {
  //uses ethereal mail by default
  nodemailer.createTestAccount((err, account) => {
    config.mailer.options.auth.user = account.user
    config.mailer.options.auth.pass = account.pass
    return cb(err);
  });
}

// We need res for rendering template.
// We can be dependent of app instead of res but its better not to expose app.
exports.sendEmail = function (req, res, options, next) {
  var config = req.app.locals.config;
  var mailTransport;

  async.waterfall([
    function (done) {
      if (config.mailer.test) {
        createTestAccount(config, (err) => {
          done(err);
        })
      } else {
        done(null)
      }
    },
    function (done) {
      mailTransport = nodemailer.createTransport(config.mailer.options);
      if (options.emailHTML) {
        done(null, options.emailHTML);
      } else if (options.path) {
        if (options.data) {
          options.data.baseUrl = options.data.baseUrl || res.locals.host;
        }
        res.render(path.resolve(options.path), options.data, function (err, emailHTML) {
          if (err) {
            console.error('Tmpl - Error : - ', err, err.message);
            console.error('Tmpl - Options ', options);
          }
          done(err, emailHTML);
        });
      }
    },
    function (emailHTML, done) {
      var mailOptions = {
        to: options.to,
        from: options.from || config.mailer.from,
        replyTo: options.replyTo,
        cc: options.cc,
        subject: options.subject,
        html: emailHTML,
        attachments: options.attachments
      };

      mailTransport.sendMail(mailOptions, function (err, response) {
        mailTransport.close();
        if (err) {
          console.error('Mail - Error : - ', err, err.message);
          console.error('Mail - Options ', mailOptions);
        }
        if (!err && config.mailer.test) {
          // retrieve sample sent from ethereal mail
          console.log('Preview URL: ' + nodemailer.getTestMessageUrl(response));
        }

        done(err); // TODO pass error message.
      });
    }
  ], function (err) {
    if (err) {
      console.error(err, err.message);
    }
    return next(err);
  });
};
