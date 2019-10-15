'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  mongoose = require('./mongoose'),
  mongoStore = require('connect-mongo')({
    session: session
  }),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  csp = require('helmet-csp'),
  flash = require('connect-flash'),
  hbs = require('express-hbs'),
  path = require('path'),
  _ = require('lodash'),
  vhost = require('vhost');

/**
 * Configure the models
 */
var initServerModels = function () {
  mongoose.loadModels();
};

/**
 * Initialize local variables
 */
var initLocalVariables = function (app, config) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.livereload = config.livereload;
  app.locals.env = process.env.NODE_ENV;

  // Passing entire config to app locals
  app.locals.config = config;

  // if behind a proxy, such as nginx...
  if (config.proxy) {
    app.set('trust proxy', 'loopback');
  }

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.get('host');
    res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
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
      collection: config.sessionCollection,
      url: config.mongoDB.uri
    })
  }));
};

/**
 * Initialize application middleware
 */
var initMiddleware = function (app, config) {
 // Should be placed before express.static
  app.use(compress({
    level: 9,
    memLevel: 9
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

  app.use(cookieParser());
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
  var serverViewPath = path.resolve(config.serverViewPath ? config.serverViewPath : './');
  app.set('views', [serverViewPath, config.staticFiles]);

  // server side html
  app.engine('server.view.html', hbs.express4({
    extname: '.server.view.html'
  }));
  app.set('view engine', 'server.view.html');

  //client side html
  app.engine('html', hbs.express4({
    extname: 'html'
  }));
  app.set('view engine', 'html');

  app.engine('js', hbs.express4({
    extname: '.js'
  }));
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
  app.use(helmet.frameguard({
    action: 'sameorigin'
  }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.noCache());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
    force: true
  }));

  // Disable cps during dev testing to prevent issues with ng-dev proxy
  if (process.env.NODE_ENV === 'production') {
    app.use(csp(config.cps));
  }

  // POST any CSP violations
  app.use('/report-violation', (req, res) => {
    if (req.body) {
      console.log('CSP Violation: ', req.body);
    } else {
      console.log('CSP Violation: No data received!');
    }
    res.status(204).end();
  });
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
    maxAge: '30d', // Cache node modules in development as well as they are not updated that frequently.
    index: false,
  }));

  // Setting the app router and static folder
  app.use('/', express.static(path.resolve(config.staticFiles), {
    maxAge: cacheTime,
    index: false,
  }));

  // Setting the app router and static folder for image paths
  let imageOptions = _.map(config.uploads.images.options),
    defaultRoute = config.app.appBaseUrl + config.app.apiBaseUrl + config.uploads.images.baseUrl;
  _.forEach(imageOptions, (option) => {
    app.use(defaultRoute + '/' + option.finalDest, express.static(path.resolve(config.uploads.images.uploadRepository + option.finalDest), {
      maxAge: option.maxAge,
      index: option.index
    }));
  })
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
    let appBaseUrl = config.appBaseUrl || '/';
    res.redirect(appBaseUrl + 'server-error');
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

var enableCORS = function (app) {
  app.use(function (req, res, next) {
    //res.header('Access-Control-Allow-Headers', 'content-type,devicetoken,usertoken');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
      res.status(204).end();
    } else {
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

  // Initialize Express session
  initSession(app, config, db);

  //  Configure mongodb models
  initServerModels();

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
  config.serverViewPath = 'server';

  // set up static file location
  config.staticFiles = 'dist/' + config.app.name + '/';

  if (config.app.appBaseUrl) {
    rootApp.use(config.app.appBaseUrl, init(config, db));
  } else if (config.app.domainPattern) {
    rootApp.use(vhost(config.app.domainPattern, init(config, db)));
  }

  rootApp = configureSocketIO(rootApp, db);

  return rootApp;
};

module.exports.initAllApps = function (db, callback) {
  var rootApp = initApps(db);
  if (callback) {
    callback(rootApp);
  }
};
