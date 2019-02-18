var emailService = require('./services/email.service'),
  // oracleQueryService = require('./services/oracle-query.service');
  // mssqlQueryService = require('./services/mssql-query.service');
  splunkLogger = require('./services/splunk-logger.service'),
  googleAnalytics = require('./services/google-analytics.service'),
  transferService = require('./services/transfer-file.service');

module.exports = {
  emailService,
  //oracleQueryService,
  // mssqlQueryService,
  splunkLogger,
  googleAnalytics,
  transferService
};