import * as defaultEnvConfig from './default.js';

export const app = {
  title: defaultEnvConfig.app.title + ' - Development'
};
export const splunkUrl = 'http://10.16.7.195:8088/services/collector';
export const splunkToken = 'replace-with-spunk';
export const mongoDB = {
  uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meancore-dev',
  options: {
    useUnifiedTopology: true
  },
  // Enable mongoose debug mode
  debug: process.env.MONGODB_DEBUG || false
};
export const oracleDB = {
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
};
export const mssqlDB = {
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
};
export const log = {
  // logging with Morgan - https://github.com/expressjs/morgan
  // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
  format: 'dev',
  fileLogger: {
    directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
    fileName: process.env.LOG_FILE || 'app.log',
    maxsize: 10485760,
    maxFiles: 2
  }
};
export const ldap = {
  server: {
    url: process.env.LDAP_URL || 'ldap://localhost:389',
    bindDn: process.env.LDAP_DN || 'CN=LDAP1,OU=Service Accounts,OU=MEANcore Users,DC=MEANcore,DC=local',
    bindCredentials: process.env.LDAP_SECRET || 'LDAP_SECRET',
    searchBase: process.env.LDAP_SEARCH_BASE || 'DC=MEANcore,DC=local',
    searchFilter: process.env.LDAP_SEARCH_FILTER || '(&(objectCategory=person)(objectClass=user)(|(sAMAccountName={{username}})(mail={{username}})))' // login with username or email
  }
};
export const google = {
  clientID: process.env.GOOGLE_ID || 'APP_ID',
  clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
  callbackURL: '/auth/google/callback',
};
export const github = {
  clientID: process.env.GITHUB_ID || 'APP_ID',
  clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
  callbackURL: '/auth/github/callback'
};
export const mailer = {
  test: process.env.MAILER_TEST || true,
  from: process.env.MAILER_FROM || 'test@meancore.com',
  options: {
    // using ethereal email for development
    host: process.env.MAILER_HOST || "smtp.ethereal.email",
    service: process.env.MAILER_SERVICE_PROVIDER || '',
    port: process.env.MAILER_PORT || 587,
    //  secure: true, // true = use TLS, false = upgrade later with STARTTLS
    auth: {
      user: process.env.MAILER_USER || "username",
      pass: process.env.MAILER_PASS || "pass"
    },
  }
};
export const livereload = true;
export const seedDB = {
  seed: process.env.MONGO_SEED || 'false',
  options: {
    logResults: process.env.MONGO_SEED_LOG_RESULTS || 'false'
  },
  // Order of collections in configuration will determine order of seeding.
  // i.e. given these settings, the User seeds will be complete before
  // Article seed is performed.
  collections: [{
    model: 'Features',
    docs: [{
      data: {
        name: 'UAC',
        route: '/uac',
        permissions: [{
          name: 'default'
        }],
        order_priority: 1
      }
    }]
  }, {
    model: 'Roles',
    docs: [{
      data: {
        name: 'admin',
        featurePermissions: ['uac:default']
      }
    }, {
      data: {
        name: 'user'
      }
    }]
  }, {
    model: 'User',
    docs: [{
      data: {
        username: 'local-admin',
        email: 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        roles: ['admin', 'user']
      }
    }, {
      // Set to true to overwrite this document
      // when it already exists in the collection.
      // If set to false, or missing, the seed operation
      // will skip this document to avoid overwriting it.
      overwrite: true,
      data: {
        username: 'local-user',
        email: 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        roles: ['user']
      }
    }]
  }]
};
