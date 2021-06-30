/**
 * Module dependencies.
 */
import {
  connectMongoDB,
  disconnectMongoDB
} from './mongoose-manager.js';
import config from '../config.js';
import {
  initAllApps
} from './express.js';
import chalk from 'chalk';

export async function init(callback) {
  await connectMongoDB(config).then(async (mongoInstance) => {
    initAllApps(mongoInstance, (httpServer) => {
      if (callback) {
        callback(httpServer, config);
      }
    });
  });
}

export function start(callback) {
  let _this = this;

  _this.init((httpServer, config) => {

    // Start the app by listening on <port> at <host>
    let server = httpServer.listen(config.port, config.host, () => {

      process.stdin.resume(); //so the program will not close instantly

      function exitHandler(options, err) {
        if (options.cleanup) console.log('clean');
        if (err) console.log(err.stack);
        // eslint-disable-next-line no-process-exit
        if (options.exit) process.exit();
        // close db connection
        disconnectMongoDB((disconnectError) => {
          if (disconnectError) {
            console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
          }

          // Finish task with error
          console.error(err);
        });
      }

      //do something when app is closing
      process.on('exit', exitHandler.bind(null, {
        cleanup: true
      }));
      //catches ctrl+c event
      process.on('SIGINT', exitHandler.bind(null, {
        exit: true
      }));
      process.on('SIGABRT', exitHandler.bind(null, {
        exit: true
      }));
      // catches "kill pid" (for example: nodemon restart)
      process.on('SIGUSR1', exitHandler.bind(null, {
        exit: true
      }));
      process.on('SIGUSR2', exitHandler.bind(null, {
        exit: true
      }));
      //catches uncaught exceptions
      process.on('uncaughtException', exitHandler.bind(null, {
        exit: true
      }));

      // Create server URL
      let serverUrl = (config.secure && config.secure.ssl ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Database:        ' + config.mongoDB.uri));
      console.log(chalk.green('Server:          ' + serverUrl));
      console.log(chalk.green('App version:     ' + config.version));
      console.log('--');

      if (callback) {
        callback(httpServer, config);
      }
    });

    server.timeout = 10 * 60 * 1000; // 10 mins
  });
}
