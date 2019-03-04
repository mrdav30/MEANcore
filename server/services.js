var emailService = require('./services/email.service'),
  splunkLogger = require('./services/splunk-logger.service'),
  googleAnalytics = require('./services/google-analytics.service'),
  transferService = require('./services/transfer-file.service'),
  ssrService = require('./services/ssr.service');

module.exports = {
  emailService,
  splunkLogger,
  googleAnalytics,
  transferService,
  ssrService
};
