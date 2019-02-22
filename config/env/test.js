'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Test'
  },
  port: process.env.PORT || 3001,
  splunkUrl: 'https://splunk.acmoore.org:8088/services/collector',
  splunkToken: 'replace-with-spunk',
  mongoDB: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meancore-test',
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  oracleDB: {
    // rms: {
    //     'connectString': process.env.DB_RMS_NAME,
    //     'user': process.env.DB_RMS_USER,
    //     'password': process.env.DB_RMS_PASS,
    //     'poolMin': 4,
    //     'poolMax': 30,
    //     'poolIncrement': 2,
    //     'poolTimeout': 120,
    //     'queueRequests': true,
    //     'queueTimeout': 0
    // },
  },
  sqlDB: {
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
    format: process.env.LOG_FORMAT || 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2
    }
  },
  uploads: {
    profile: {
      image: {
        dest: './modules/users/client/img/profile/uploads/',
        limits: {
          fileSize: 100000 // Limit filesize (100kb) for testing purposes
        }
      }
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
    callbackURL: '/auth/google/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
      //SNMP
      // host: 'MAILER_HOST',
      // port: MAILER_PORT,
      // tls: {
      //     rejectUnauthorized: false
      // },
      // ignoreTLS: true
    }
  }
};