export const app = {
  title: 'MEANcore - MeanStack Web Projects!',
  name: 'core',
  description: 'Applications running on mean stack',
  keywords: 'mongodb, express, angular2+, typescript, node.js, mongoose, passport',
  logo: process.env.APP_LOGO || 'assets/images/logo.png',
  appBaseUrl: process.env.APP_BASE_URL || '/',
  apiBaseUrl: process.env.API_BASE_URL || 'api',
  defaultPage: 'index.html',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  // domain name as string or RegEx
  // "For any value containing & must be escaped with ^ i.e. ABC=M&M should be ABC=M^&M"
  // domainPattern: 'localhost',
  domain: process.env.DOMAIN,
  defaultRoute: process.env.APP_DEFAULT_ROUTE || '',
  metaTitleSuffix: process.env.META_TITLE_SUFFIX || ' | MEANcore'
};
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || '';
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
export const GOOGLE_VIEW_ID = process.env.GOOGLE_VIEW_ID || '';
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '';
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
export const TWITTER_HANDLE = process.env.TWITTER_HANDLE || '';
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
export const sessionSecret = process.env.SESSION_SECRET || 'MEANCORE';
export const sessionKey = process.env.SESSION_KEY || 'meancore-key';
export const sessionCollection = process.env.SESSION_COLLECTION || 'meancore-sessions';
export const csp = {
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: [
      "'self'",
      'https://www.google-analytics.com/',
      'https://www.googletagmanager.com/gtag/'
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      'https://www.google-analytics.com/',
      'https://www.googletagmanager.com/gtag/'
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
      'https://www.googletagmanager.com/',
      'https://www.gstatic.com/images/branding/'
    ],
    objectSrc: ["'none'"],
  },
  reportUri: '/report-violation',
  upgradeInsecureRequests: true,
  workerSrc: false // This is not set.
};
export const illegalUsernames = ['meancore', 'administrator', 'password', 'admin', 'user',
  'unknown', 'anonymous', 'null', 'undefined', 'api'
];
export const owaspConfig = {
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4,
  passwordExpirationDays: 90,
  resetPasswordExpiresMS: 3600000 // 1 hour
};
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
export const scriptStore = [{
  // Required for google analytics 
  name: 'gtag',
  src: 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ANALYTICS_ID,
  async: true
}];
