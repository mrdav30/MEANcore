'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Development'
  },
  splunkUrl: 'http://10.16.7.195:8088/services/collector',
  splunkToken: 'replace-with-spunk',
  mongoDB: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meancore-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  oracleDB: {
    // rms: {
    //     'connectString': process.env.DB_RMS_NAME || '',
    //     'poolMin': 4,
    //     'poolMax': 200,
    //     'poolIncrement': 4,
    //     'poolTimeout': 60,
    //     'user': process.env.DB_RMS_USER || 'API_USER',
    //     'password': process.env.DB_RMS_PASS || 'API_USER',
    //     'queueRequests': true,
    //     'queueTimeout': 0
    // },
  },
  mssqlDB: {
    // gppyrl: {
    //     'user': '',
    //     'password': '',
    //     'server': '',
    //     'database': '',
    //     'requestTimeout': 300000,
    //     'pool': {
    //         'max': 10,
    //         'min': 4,
    //         'idleTimeoutMillis': 30000
    //     },
    //     'options': {
    //         'useColumnNames': false
    //     }
    // }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2
    }
  },
  ldap: {
    server: {
      url: process.env.LDAP_URL || 'ldap://localhost:389',
      bindDn: process.env.LDAP_DN || 'CN=LDAP1,OU=Service Accounts,OU=MEANcore Users,DC=MEANcore,DC=local',
      bindCredentials: process.env.LDAP_SECRET || 'LDAP_SECRET',
      searchBase: process.env.LDAP_SEARCH_BASE || 'DC=MEANcore,DC=local',
      searchFilter: process.env.LDAP_SEARCH_FILTER || '(&(objectCategory=person)(objectClass=user)(|(sAMAccountName={{username}})(mail={{username}})))' // login with username or email
    }
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/auth/google/callback',
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'test@meancore.com',
    options: {
      // using ethereal email for development
      host: process.env.MAILER_HOST || "smtp.ethereal.email",
      port: process.env.MAILER_PORT || 587,
      service: process.env.MAILER_SERVICE_PROVIDER || '',
      //  secure: true, // true = use TLS, false = upgrade later with STARTTLS
      auth: {
        user: process.env.MAILER_USER || "username",
        pass: process.env.MAILER_PASS || "pass"
      },
    //   tls: {
    //     // do not fail on invalid certs
    //     rejectUnauthorized: false,
    //     ciphers: 'SSLv3'
    //   }
    }
  },
  livereload: true
};
