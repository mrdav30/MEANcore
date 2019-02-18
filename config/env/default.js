'use strict';

module.exports = {
  app: {
    title: 'MEANcore - MeanStack Web Projects!',
    name: 'MEANcore',
    description: 'Applications runing on mean stack',
    keywords: 'mongodb, express, angularjs, typescript, node.js, mongoose, passport',
    appBase: '/',
    domainPattern: '',
    defaultPage: 'index.html'
  },
  // Config required for Google Analytics
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || 'UA-133696885-1',
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL || 'pageviews@meancore-cms.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLrhwfA9pv26Qy\n7jH5+Xfw1zrYmxpJD3i3US9nGhiwV6KKawO8odVfY7mg4/iJ+UwibPUsIXUgUADT\nMQwA3KOpsU4kSe7RgZwjfQx19k3401lG3adgdxVL6BLKfN6x4tBtw7e4/NdQx3Uo\nNGG8Sj6fCaSTogjOUuS2GD6kzu1QR88+xeYOgkyNG1g2rdyHSxkSXeZ0x1ue3cxu\n39xpeuArg1+fYp0101BolguXrIEWK3vC/e6B3dYPfgBKMsx+sxJxjkZidq/+b4Pn\ndyUHxe7ZI6pw0JXbSiw0UKHACN4TEfXijHm0PjvuuS41/B9SfLd8EliadjW3ML2u\nApgw0vl3AgMBAAECggEAVFb00wzz6ySuod5LOIEKHuLovZ/AKyeqa3JFKDLArWik\naB+3DOmQYq73Qz2TAYMG+SxX+12hU+983/ary0GRzacbPeCVcRBz2KgjvEbw84uE\nqNkIwWOeIG/pNAqv5kYO25zTG1krSYpGI49JN0AhHRbPnMhYUCM4DIUOj40V7IsJ\nhu3R2pAPldJYIvEo7ST5l5cuIzSAhts5ghWwRhfM+s1HBA30K5lFWlr3cRHMwvNW\nCmdmUlRSPSdB7OfqvnPx7ALY6OcrpLSmtP18ND8kgBVLoL7dgU+7v0CvdXvwU2ck\nicogwYgUKTXBPpPIMSvckQwJ8h5khGsCFJ9gZrIb/QKBgQD9wDlg0+ifo86WJqM9\nY4qJhdEIe84RObkCwiih4d53qTySu7YWaYUtWL4+SKvj8ZDcgzRhyfzLFS/eg5wh\nRQPKcOtH6ZyRCxpGEcr3lpiql2TjP/MR8pFgoetUqZx3rpKqxHQfSKrZPPUKzCjy\ncIu5UHpcL65NxQhCCTMLjbT9iwKBgQDNfEWtZcmShIXmygAHdNyh5rLIW14z4Plf\nJQX07VmUwDH7gtD9SUtNe531QkY/laAIQCMMHV9C/TJTfQmZifKE8C6m83LCHMt9\nlG3YHoDriH5FLcah0O2wHa+RkDb/whsGpA7Pk8v4X0Ct1iiFlyNuZDBJ+jVcaIO6\nWyeje/pJRQKBgQDv/YCG+oSVj5iQXCShp+Zb4MrtiiJAGmbHnBhP2s7MP6yBXrV9\nhvklBTyQraycnliSpijBoAbNj9FBUxo0QRCvw5JS5jhk2apUwPlEpxLmrN8HKvFa\ndR9X1Gw9G1lXvC0NA1aMS+8CHOvo9WR4v0b20o2XaKUi+omv4wF7GOAntwKBgGDX\nHmdXvyWj+w8HR/g7pPdQKBWwqba9YgjrA+GoMj2eTm//+MpFzo1XotvBPiYdN+xr\nfZjqBsklVqBuHyYTEw5/uxzHQuAkfepTF2lxBsT58LhdmG0Ob9Y+R03Mr37dVatN\nigVd3BTTn0HN2g8LaZFO+ksC9j70qpAbAZVUimIZAoGAXTOToJOa1y5h7tsHxmC5\nIT9g/JkbRJ3K3qXHndzivfISOQ7IHIwUHmG/ISG6QxRhongN/thAbQ5mWkMdUDQb\nmbi0/Wipsq0s+emvLm7nqlPKRoqcthvKoUqjav7YmCFKs7rPYzAqjsMUhtQ+keLQ\nXGun/f2jcMyHhYTT+kV7ARw=\n-----END PRIVATE KEY-----\n',
  GOOGLE_VIEW_ID: process.env.GOOGLE_VIEW_ID || '189201629',
  // Config required for Google Recaptcha
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '6LfVRpAUAAAAAKkYiWEj6-WDFSYY_e22Q30HBs9L',
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '6LfVRpAUAAAAAMya-xdhQ8GWigc0jbJ-Gt2Tqngq',
  mongoDB: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
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
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET
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
