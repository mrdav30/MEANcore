'use strict';

module.exports = {
  app: {
    title: 'MEANcore - MeanStack Web Projects!',
    name: process.env.APP_NAME || 'meancore',
    description: 'Applications runing on mean stack',
    keywords: 'mongodb, express, angular2+, typescript, node.js, mongoose, passport',
    appBase: process.env.APP_BASE_URL || '/',
    defaultPage: 'index.html'
  },
  // Config required for Google Analytics
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL || '',
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY || '',
  GOOGLE_VIEW_ID: process.env.GOOGLE_VIEW_ID || '',
  // Config required for Google Recaptcha
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
  mongoDB: {
    promise: global.Promise,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  domainPattern: process.env.DOMAIN_PATTERN || '',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEANcore',
  // sessionKey is the cookie session name
  sessionKey: process.env.SESSION_KEY || 'sessionId',
  sessionCollection: process.env.SESSION_COLLECTION || 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  illegalUsernames: ['meancore', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      bucket: process.env.S3_BUCKET || ''
    }
  },
  uploads: {
    // Storage can be 'local' or 's3'
    storage: process.env.UPLOADS_STORAGE || 'local',
    profile: {
      image: {
        dest: './modules/users/client/img/profile/uploads/',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  }
};
