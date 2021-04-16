/**
 * Module dependencies.
 */
import config from '../config.js';
import express from 'express';
import morgan from 'morgan';
import logger from './logger.js';
import {
  startTaskScheduler
} from './agenda.js';
import bodyparser from 'body-parser';
import session from 'express-session';
import {
  loadMongoModels
} from './mongoose-manager.js';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csp from 'helmet-csp';
import nocache from 'nocache';
import flash from 'connect-flash';
import expresshbs from 'express-hbs';
import url from 'url';
import fs from 'fs';
import {
  resolve,
  dirname
} from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import vhost from 'vhost';

/**
 * Initialize local variables
 */
const initLocalvariables = function (app, moduleConfig) {
  // Setting application local variables
  app.locals.title = moduleConfig.app.title;
  app.locals.description = moduleConfig.app.description;
  if (moduleConfig.secure && moduleConfig.secure.ssl) {
    app.locals.secure = moduleConfig.secure.ssl;
  }
  app.locals.keywords = moduleConfig.app.keywords;
  app.locals.livereload = moduleConfig.livereload;
  app.locals.env = process.env.NODE_ENV;

  // Passing entire config to app locals
  app.locals.config = moduleConfig;

  // if behind a proxy, such as nginx...
  if (moduleConfig.proxy) {
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
const initSession = (app, moduleConfig, db) => {
  app.use(session({
    saveUninitialized: false, // dont save unmodified
    resave: false, // forces the session to be saved back to the store
    secret: moduleConfig.sessionSecret,
    cookie: {
      maxAge: moduleConfig.sessionCookie.maxAge,
      httpOnly: moduleConfig.sessionCookie.httpOnly,
      secure: moduleConfig.sessionCookie.secure && moduleConfig.secure.ssl
    },
    name: moduleConfig.sessionKey,
    store: new MongoStore({
      db: db,
      collection: moduleConfig.sessionCollection,
      url: moduleConfig.mongoDB.uri
    })
  }));
};

/**
 * Initialize application middleware
 */
const initMiddleware = (app, moduleConfig) => {
  // Should be placed before express.static
  app.use(compress({
    level: 9,
    memLevel: 9
  }));

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(moduleConfig, 'log.format')) {
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
  app.use(bodyparser.urlencoded({
    extended: true,
    limit: '260mb'
  }));
  app.use(bodyparser.json({
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
const initHandlebars = function () {
  expresshbs.registerHelper('currency', (number) => {
    if (number === null || isNaN(number)) {
      return number;
    }
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  });

  expresshbs.registerHelper('decimal', (number) => {
    if (number === null || isNaN(number)) {
      return number;
    }
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    }).substr(1);
  });

  expresshbs.registerHelper('ifeq', (a, b, options) => {
    return a == b ? options.fn(this) : options.inverse(this); // eslint-disable-line
  });

  expresshbs.registerHelper('ifnoteq', (a, b, options) => {
    return a != b ? options.fn(this) : options.inverse(this); // eslint-disable-line
  });

};

/**
 * Configure view engine
 */
const initViewEngine = (app, moduleConfig) => {
  let serverViewPaths = [];
  for(let path of moduleConfig.serverViewPaths) {
     serverViewPaths.push(resolve(path ? path : './'));
  }

  app.set('views', [...serverViewPaths, moduleConfig.staticFilesPath]);

  // server side html
  app.engine('server.view.html', expresshbs.express4({
    extname: '.server.view.html'
  }));
  app.set('view engine', 'server.view.html');

  //client side html
  app.engine('html', expresshbs.express4({
    extname: 'html'
  }));
  app.set('view engine', 'html');

  app.engine('js', expresshbs.express4({
    extname: '.js'
  }));
};

const initSharedConfiguration = async (config) => {
  // assigning services to configs
  await Promise.all(config.files.services.map(async (serviceFile) => {
    let servicePath = url.pathToFileURL(resolve(serviceFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(servicePath).then(async (service) => {
      config.services = {
        ...config.services,
        ...service
      };
    });
  })).catch((err) => {
    console.log(err);
  });

  // assigning helpers to configs
  await Promise.all(config.files.helpers.map(async (helpersFile) => {
    let helpersPath = url.pathToFileURL(resolve(helpersFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(helpersPath).then((helper) => {
      config.helpers = {
        ...config.helpers,
        ...helper
      };
    });
  })).catch((err) => {
    console.log(err);
  });


  // assigning shared modules to configs
  await Promise.all(config.files.sharedModules.map(async (sharedModuleFile) => {
    let sharedModulePath = url.pathToFileURL(resolve(sharedModuleFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(sharedModulePath).then(async (shareModule) => {
      config.shareModules = {
        ...config.shareModules,
        ...shareModule
      };
      if (shareModule.default) {
        await shareModule.default();
      }
    });
  })).catch((err) => {
    console.log(err);
  });

  // read package.json for MEANCore project information
  await fs.promises.readFile(resolve('./package.json')).then((jsonStr) => {
    const data = JSON.parse(jsonStr);
    config.version = data.version;
  }).catch((err) => {
    console.log(err);
  });
}

/**
 * Invoke server configuration
 */
const initServerConfiguration = async (app, config) => {
  await Promise.all(config.files.configs.map(async (configFile) => {
    let configPath = url.pathToFileURL(resolve(configFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(configPath).then(async (appConfig) => {
      await appConfig.default(app);
    }).catch((err) => {
      console.log(err);
    });
  }));
};

/**
 * Configure Helmet headers configuration
 */
const initHelmetHeaders = (app, moduleConfig) => {
  // Use helmet to secure Express headers
  let SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard({
    action: 'sameorigin'
  }));
  app.use(helmet.hidePoweredBy());
  app.use(nocache());
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
    app.use(csp(moduleConfig.cps));
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
const initClientRoutes = (app, moduleConfig) => {
  let cacheTime = -9999;
  if (process.env.NODE_ENV !== 'development') {
    cacheTime = '30d';
  }

  // in development mode files are loaded from node_modules
  app.use('/node_modules', express.static(resolve(moduleConfig.staticFilesPath + '../../node_modules/'), {
    maxAge: '30d', // Cache node modules in development as well as they are not updated that frequently.
    index: false,
  }));

  // Setting the app router and static folder
  app.use('/', express.static(resolve(moduleConfig.staticFilesPath), {
    maxAge: cacheTime,
    index: false,
  }));

  // Setting the app router and static folder for image paths
  const imageOptions = _.map(moduleConfig.uploads.images.options);
  const defaultRoute = moduleConfig.app.appBaseUrl + moduleConfig.app.apiBaseUrl + moduleConfig.uploads.images.baseUrl;
  _.forEach(imageOptions, (option) => {
    app.use(defaultRoute + '/' + option.finalDest, express.static(resolve(moduleConfig.uploads.images.uploadRepository + option.finalDest), {
      maxAge: option.maxAge,
      index: option.index
    }));
  })
};

/**
 * Configure the server routes
 */
const initServerRoutes = async (app, config) => {
  for (const routeFile of config.files.routes) {
    let routePath = url.pathToFileURL(resolve(routeFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(routePath).then(async (route) => {
      await route.default(app);
    }).catch((err) => {
      console.log(err);
    });
  }
};

/**
 * Configure error handling
 */
const initErrorRoutes = (app, moduleConfig) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    const appBaseUrl = moduleConfig.appBaseUrl || '/';
    res.redirect(appBaseUrl + 'server-error');
  });
};

const initTaskScheduler = async (db, moduleConfig) => {
  // Start Agenda task scheduler
  await startTaskScheduler(db).then((scheduler) => {
    moduleConfig.taskScheduler = scheduler;
  });
}

/**
 * Configure Socket.io
 */
const configureSocketIO = async (app, db) => {
  // Load the Socket.io configuration
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const server = await import('./socket.io.js');
    return server.default(app, db);
  } catch (err) {
    console.log(err);
  }
};

const enableCORS = (app) => {
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
 * Initialize each Express application listed in the modules directory
 */
const init = async (moduleConfig, db) => {
  // Initialize express app
  let app = express();

  // Initialize local variables
  initLocalvariables(app, moduleConfig);

  // Initialize Express middleware
  initMiddleware(app, moduleConfig);

  // Initialize Handlebars helper
  initHandlebars();

  // set up server views
  moduleConfig.serverViewPaths = _.chain(moduleConfig.files.views).map((view) => {
    return dirname(view);
  }).uniq().map().value();

  // set up static file location
  moduleConfig.staticFilesPath = 'dist/' + moduleConfig.app.name + '/';

  // Initialize Express view engine
  initViewEngine(app, moduleConfig);

  // Initialize Helmet security headers
  initHelmetHeaders(app, moduleConfig);

  // Enable cors
  enableCORS(app);

  // Initialize modules static client routes, before session!
  initClientRoutes(app, moduleConfig);

  // Initialize Express session
  initSession(app, moduleConfig, db);

  // Initialize error routes
  initErrorRoutes(app, moduleConfig);

  // Initialize Agenda for task scheduling 
  initTaskScheduler(db, moduleConfig);

  await Promise.all([
    // Initialize modules server configuration
    await initServerConfiguration(app, moduleConfig),
    // Initialize modules server routes
    await initServerRoutes(app, moduleConfig)
  ]);

  console.log('--');
  console.log(chalk.green('Loading Completed for: ' + moduleConfig.app.name));

  return app;
};

// Begin initialization of core and all mods 
async function initApps(db) {
  // need to decide if use express or connect??
  let rootApp = express();

  // Initialize global globbed shared config
  await initSharedConfiguration(config);

  //  Configure mongodb models
  await loadMongoModels(config);

  const moduleConfigs = await config.utils.retrieveModuleConfigs(config);

  if (moduleConfigs.length === 0) {
    console.log(chalk.bold.yellow('No submodules loaded...loading default core!'))
    moduleConfigs.push(config);
  }

  // Now initialize each module set in allConfigs
  await Promise.all(moduleConfigs.map(async (moduleConfig) => {
    await init(moduleConfig, db).then((module) => {
      if (moduleConfig.app.appBaseUrl) {
        rootApp.use(moduleConfig.app.appBaseUrl, module);
      } else if (moduleConfig.app.domainPattern) {
        rootApp.use(vhost(moduleConfig.app.domainPattern, module));
      }
    });
  }));

  rootApp = await configureSocketIO(rootApp, db);

  return rootApp;
}

export async function initAllApps(db, callback) {
  const rootApp = await initApps(db);
  if (callback) {
    return callback(rootApp);
  }

  return;
}
