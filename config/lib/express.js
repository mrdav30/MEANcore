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
import fse from 'fs-extra';
import {
  resolve,
  join
} from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import vhost from 'vhost';

/**
 * Initialize local variables
 */
const initLocalvariables = function (app, config) {
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
const initSession = (app, config, db) => {
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
    store: new MongoStore({
      db: db,
      collection: config.sessionCollection,
      url: config.mongoDB.uri
    })
  }));
};

/**
 * Initialize application middleware
 */
const initMiddleware = (app, config) => {
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
const initViewEngine = (app, config) => {
  let serverViewPath = resolve(config.serverViewPath ? config.serverViewPath : './');
  app.set('views', [serverViewPath, config.staticFiles]);

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
    await import(sharedModulePath).then((shareModule) => {
      config.shareModules = {
        ...config.shareModules,
        ...shareModule
      };
    });
  })).catch((err) => {
    console.log(err);
  });

  // set up view
  config.serverViewPath = 'server';
  // set up static file location
  config.staticFiles = 'dist/' + config.app.name + '/';

  // read package.json for MEANCore project information
  await fse.readFile(resolve('./package.json')).then((jsonStr) => {
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
const initHelmetHeaders = (app) => {
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
const initClientRoutes = (app, config) => {
  let cacheTime = -9999;
  if (process.env.NODE_ENV !== 'development') {
    cacheTime = '30d';
  }

  // in development mode files are loaded from node_modules
  app.use('/node_modules', express.static(resolve(config.staticFiles + '../../node_modules/'), {
    maxAge: '30d', // Cache node modules in development as well as they are not updated that frequently.
    index: false,
  }));

  // Setting the app router and static folder
  app.use('/', express.static(resolve(config.staticFiles), {
    maxAge: cacheTime,
    index: false,
  }));

  // Setting the app router and static folder for image paths
  const imageOptions = _.map(config.uploads.images.options);
  const defaultRoute = config.app.appBaseUrl + config.app.apiBaseUrl + config.uploads.images.baseUrl;
  _.forEach(imageOptions, (option) => {
    app.use(defaultRoute + '/' + option.finalDest, express.static(resolve(config.uploads.images.uploadRepository + option.finalDest), {
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
const initErrorRoutes = (app, config) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    const appBaseUrl = config.appBaseUrl || '/';
    res.redirect(appBaseUrl + 'server-error');
  });
};

const initTaskScheduler = async (db, config) => {
  // Start Agenda task scheduler
  await startTaskScheduler(db).then((scheduler) => {
    config.taskScheduler = scheduler;
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
 * Initialize the Express application
 */
const init = async (config, db) => {
  // Initialize express app
  let app = express();

  // Initialize local variables
  initLocalvariables(app, config);

  // Initialize Express middleware
  initMiddleware(app, config);

  // Initialize Handlebars helper
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

  // Initialize error routes
  initErrorRoutes(app, config);

  // Initialize Agenda for task scheduling 
  initTaskScheduler(db, config);

  await Promise.all([
    // Initialize modules server configuration
    await initServerConfiguration(app, config),
    // Initialize modules server routes
    await initServerRoutes(app, config)
  ]);

  console.log('--');
  console.log(chalk.green('Loading Completed for: ' + config.app.name));

  return app;
};

async function initApps(db) {
  // need to decide if use express or connect??
  let rootApp = express();

  // Initialize global globbed shared config
  await initSharedConfiguration(config);

  //  Configure mongodb models
  await loadMongoModels(config);

  let allConfigs = [];
  await Promise.all(config.submodules.map(async (module) => {
    const originalConfig = _.cloneDeep(config);
    const appConfigPath = url.pathToFileURL(module.appConfig).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let appConfig = await import(appConfigPath);
    const newConfig = _.mergeWith({}, originalConfig, appConfig, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    const moduleEnvConfigPath = url.pathToFileURL(join(process.cwd(), module.basePath + '/env', process.env.NODE_ENV + '.js')).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const moduleEnvConfig = await import(moduleEnvConfigPath);

    // Merge default core config with submodules specific config
    appConfig = _.mergeWith({}, newConfig, moduleEnvConfig, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });
    allConfigs.push(appConfig);
  }));

  if (allConfigs.length === 0) {
    console.log(chalk.bold.yellow('No submodules loaded...loading default core!'))
    allConfigs.push(config);
  }

  // Now each submodule
  await Promise.all(allConfigs.map(async (moduleConfig) => {
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
