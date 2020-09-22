export const app = {
  title: 'MEANcore - MeanStack Web Projects!',
  name: 'meancore',
  description: 'Applications running on mean stack',
  keywords: 'mongodb, express, angular2+, typescript, node.js, mongoose, passport',
  appBaseUrl: process.env.APP_BASE_URL || '/',
  apiBaseUrl: process.env.API_BASE_URL || 'api',
  defaultPage: 'index.html'
};
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
export const GOOGLE_VIEW_ID = process.env.GOOGLE_VIEW_ID || '';
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
export const mongoDB = {
  promise: global.Promise,
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: 30000,
    connectTimeoutMS: 30000
  }
};
export const port = process.env.PORT || 3000;
export const host = process.env.HOST || '0.0.0.0';
export const sessionCookie = {
  // session expiration is set by default to 24 hours
  maxAge: 24 * (60 * 60 * 1000),
  // httpOnly flag makes sure the cookie is only accessed
  // through the HTTP protocol and not JS/browser
  httpOnly: true,
  // secure cookie should be turned to true to provide additional
  // layer of security so that the cookie is set only when working
  // in HTTPS mode.
  secure: false
};
export const sessionSecret = process.env.SESSION_SECRET || 'MEANcore';
export const sessionKey = process.env.SESSION_KEY || 'sessionId';
export const sessionCollection = process.env.SESSION_COLLECTION || 'sessions';
export const cps = {
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: [
      "'self'",
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      'https://www.googletagmanager.com/gtag/',
      'https://www.google-analytics.com/'
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com/s/montserrat/'
    ],
    frameSrc: ["'self'"],
    imgSrc: [
      "'self'",
      'data:',
      'https://www.google-analytics.com/',
      'https://www.gstatic.com/images/branding/'
    ],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false // This is not set.
  }
};
export const illegalUsernames = ['meancore', 'administrator', 'password', 'admin', 'user',
  'unknown', 'anonymous', 'null', 'undefined', 'api'
];
export const aws = {
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    bucket: process.env.S3_BUCKET || ''
  }
};
export const uploads = {
  images: {
    baseUrl: process.env.IMAGE_BASE_URL || '/image-uploads',
    uploadRepository: process.env.IMAGE_STORAGE || './_content/image-uploads/',
    limits: {
      fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
    },
    options: {
      profile: {
        finalDest: 'profile',
        maxAge: (24 * 60 * 60 * 30) * 1000,
        index: false
      }
    }
  }
};
