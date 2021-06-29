import * as defaultEnvConfig from './default.js';

export const app = {
  title: defaultEnvConfig.app.title + ' - Test'
};
export const port = process.env.PORT || 3001;
export const splunkUrl = 'https://splunk.acmoore.org:8088/services/collector';
export const splunkToken = 'replace-with-spunk';
export const mongoDB = {
  uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meancore-test',
  options: {
    useUnifiedTopology: true
  },
  // Enable mongoose debug mode
  debug: process.env.MONGODB_DEBUG || false
};
export const oracleDB = {
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
};
export const sqlDB = {
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
  format: process.env.LOG_FORMAT || 'dev',
  fileLogger: {
    directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
    fileName: process.env.LOG_FILE || 'app.log',
    maxsize: 10485760,
    maxFiles: 2
  }
};
export const uploads = {
  images: {
    baseUrl: process.env.IMAGE_BASE_URL || '/image-uploads',
    uploadRepository: process.env.IMAGE_STORAGE || './_content/image-uploads/',
    limits: {
      fileSize: 100000 // Limit filesize (100kb) for testing purposes
    }
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
  callbackURL: '/auth/google/callback'
};
export const github = {
  clientID: process.env.GITHUB_ID || 'APP_ID',
  clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
  callbackURL: '/auth/github/callback'
};
export const mailer = {
  test: process.env.MAILER_TEST || true,
  from: process.env.MAILER_FROM || 'test@meacore.com',
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
export const seedDB = {
  options: {
    logResults: process.env.MONGO_SEED_LOG_RESULTS || 'false'
  },
  // Order of collections in configuration will determine order of seeding.
  // i.e. given these settings, the Features seeds will be complete before
  // Roles seed is performed.
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
        username: 'seeduser',
        email: 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        roles: ['user']
      }
    }]
  }]
};
