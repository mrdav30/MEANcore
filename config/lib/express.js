'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('express'),
  fs = require('fs'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')({
    session: session
  }),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  hbs = require('express-hbs'),
  path = require('path'),
  _ = require('lodash'),
  lusca = require('lusca'),
  vhost = require('vhost');

// Auth servers may not have valid SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Configure the models
 */
var initServerModels = function (config) {
  // Globbing routing files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
};

/**
 * Initialize local variables
 */
var initLocalVariables = function (app, config) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.livereload = config.livereload;
  app.locals.env = process.env.NODE_ENV;

  // Passing entire config to app locals
  app.locals.config = config;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Configure Express session
 */
var initSession = function (app, config, db) {
  app.use(session({
    saveUninitialized: false, // dont save unmodified
    resave: false, // forces the session to be saved back to the store
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    name: config.sessionKey,
    store: new mongoStore({
      db: db,
      collection: config.sessionCollection
    })
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};

/**
 * Initialize application middleware
 */
var initMiddleware = function (app, config) {
  //Compression is being handled at NGINX level?
  //Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '260mb'
  }));
  app.use(bodyParser.json({
    limit: '260mb'
  }));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());

  // // Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
  // app.use(function (req, res, next) {
  //     // if there's a flash message in the session request, make it available in the response, then delete it
  //     if (req.session && req.session.sessionFlash) {
  //         res.locals.sessionFlash = req.session.sessionFlash;
  //         delete req.session.flash;
  //     }
  //     next();
  // });

  app.use(cookieParser());
  app.use(function (req, res, next) {
    if (req.originalUrl.length <= 1) {
      let toApp = req.cookies.lastapp;
      if (config.appBase !== toApp) {
        toApp = '/';
      }
      res.redirect(toApp);
    } else if (req.originalUrl === '/favicon.ico') {
      res.sendFile(config.staticFiles + 'favicon.ico', {
        root: '.'
      });
    } else {
      next();
    }
  });
};

/**
 * Configure handlebars Helpers
 */
var initHandlebars = function () {
  hbs.registerHelper('currency', function (number, options) {
    if (number === null || isNaN(number)) {
      return number;
    }
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  });

  hbs.registerHelper('decimal', function (number, options) {
    if (number === null || isNaN(number)) {
      return number;
    }
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    }).substr(1);
  });

  hbs.registerHelper('ifeq', (a, b, options) => {
    return a == b ? options.fn(this) : options.inverse(this); // eslint-disable-line
  });

  hbs.registerHelper('ifnoteq', (a, b, options) => {
    return a != b ? options.fn(this) : options.inverse(this); // eslint-disable-line
  });

};

/**
 * Configure view engine
 */
var initViewEngine = function (app, config) {
  app.engine('server.view.html', hbs.express4({
    extname: '.server.view.html'
  }));
  app.set('view engine', 'server.view.html');
  app.engine('js', hbs.express4({
    extname: '.js'
  }));
  var viewDir = path.resolve(config.appViewPath ? config.appViewPath : './');
  app.set('views', viewDir);
};

/**
 * Invoke server configuration
 */
var initServerConfiguration = function (app, config) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app);
  });
};

/**
 * Configure Helmet headers configuration
 */
var initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
var initClientRoutes = function (app, config) {
  var cacheTime = -9999;
  if (process.env.NODE_ENV !== 'development') {
    cacheTime = '30d';
  }

  // in development mode files are loaded from node_modules
  app.use('/node_modules', express.static(path.resolve(config.staticFiles + '../../node_modules/'), {
    maxAge: '30d', // Cache node modules in development as well as they are not updated that frequantly.
    index: false,
    setHeaders: function (res, path, stat) {
      res.setHeader('Cache-Control', '');
      res.setHeader('Pragma', '');
    }
  }));

  // Setting the app router and static folder
  app.use('/', express.static(path.resolve(config.staticFiles), {
    maxAge: cacheTime,
    index: false,
    setHeaders: function (res, path, stat) {
      res.setHeader('Cache-Control', '');
      res.setHeader('Pragma', '');
    }
  }));
};

/**
 * Configure the server routes
 */
var initServerRoutes = function (app, config) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
var initErrorRoutes = function (app, config) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    let appBase = config.appBase || '/';
    res.redirect(appBase + 'server-error');
  });
};

/**
 * Configure Socket.io
 */
var configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Connect to all required databases
 *
 **/
var initDatabases = function (cb) {
  //uncomment to prepare oracle db connections set in config
  // oracleQueryService.prepareService(cb);
  return cb();
};

var enableCORS = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'content-type,devicetoken,usertoken');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
    } else {
      res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.setHeader('Pragma', 'no-cache');
      next();
    }
  });
};

/**
 * Initialize the Express application
 */
var init = function (config, db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  initLocalVariables(app, config);

  // Initialize Express session
  initSession(app, config, db);

  // Initialize Express middleware
  initMiddleware(app, config);

  // Initialize Handlebars halper
  initHandlebars();

  // Initialize Express view engine
  initViewEngine(app, config);

  // Initialize Helmet security headers
  initHelmetHeaders(app);

  // Enable cors
  enableCORS(app);

  // Initialize modules static client routes, before session!
  initClientRoutes(app, config);

  //  Configure mongodb models
  initServerModels(config);

  // // Initialize Express session
  // initSession(app, config, db);

  // Initialize Modules configuration
  initServerConfiguration(app, config);

  // Initialize modules server routes
  initServerRoutes(app, config);

  // Initialize error routes
  initErrorRoutes(app, config);

  console.log('Loading Completed for: ' + config.app.name);
  return app;
};

var initApps = function (db) {
  // need to decide if use express or connect??
  var rootApp = express();

  // assigning services to configs.
  config.services = require(path.resolve('./server/services.js'));

  // assigning helpers to configs
  config.helpers = require(path.resolve('./server/helpers.js'));

  // set up view
  config.appViewPath = '/server';

  // set up static file location
  config.staticFiles = 'dist/' + config.app.name + '/';

  if (config.app.appBase) {
    rootApp.use(config.app.appBase, init(config, db));
  } else if (config.app.domainPattern) {
    rootApp.use(vhost(config.app.domainPattern, init(config, db)));
  }

  rootApp = configureSocketIO(rootApp, db);

  return rootApp;
};

module.exports.initAllApps = function (db, callback) {
  // Initialize databases using query service will be shared accross various modules;
  initDatabases(function () {
    var rootApp = initApps(db);
    if (callback) {
      callback(rootApp);
    }
  });
};
