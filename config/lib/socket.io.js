// Load the module dependencies
import config from '../config.js';
import {
  resolve
} from 'path';
import url from 'url';
import fs from 'fs';
import {
  createServer
} from 'http';
import {
  createServer as _createServer
} from 'https';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import socket from 'socket.io';
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

// Define the Socket.io configuration method
export default (app, db) => {
  let server;
  if (config.secure && config.secure.ssl) {
    // Load SSL key and certificate
    const privateKey = fs.readFileSync(resolve(config.secure.privateKey), 'utf8');
    const certificate = fs.readFileSync(resolve(config.secure.certificate), 'utf8');
    let caBundle;

    try {
      caBundle = fs.readFileSync(resolve(config.secure.caBundle), 'utf8');
    } catch (err) {
      console.log('Warning: couldn\'t find or read caBundle file');
    }

    const options = {
      key: privateKey,
      cert: certificate,
      ca: caBundle,
      //  requestCert : true,
      //  rejectUnauthorized : true,
      secureProtocol: 'TLSv1_method',
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        'DHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'DHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA256',
        'DHE-RSA-AES256-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':'),
      honorCipherOrder: true
    };

    // Create new HTTPS Server
    server = _createServer(options, app);
  } else {
    // Create a new HTTP server
    server = createServer(app);
  }
  // Create a new Socket.io server
  const io = socket.listen(server);

  // Create a MongoDB storage object
  const store = new MongoStore({
    db: db,
    collection: config.sessionCollection,
    url: config.mongoDB.uri
  });

  // Intercept Socket.io's handshake request
  io.use(function (socket, next) {
    // Use the 'cookie-parser' module to parse the request cookies
    cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
      // Get the session id from the request cookies
      if (err) console.log(err);
      let sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

      if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

      // Use the mongoStorage instance to get the Express session information
      store.get(sessionId, function (err, session) {
        if (err) return next(err, false);
        if (!session) return next(new Error('session was not found for ' + sessionId), false);

        // Set the Socket.io session information
        socket.request.session = session;

        // Use Passport to populate the user details
        passport.initialize()(socket.request, {}, function () {
          passport.session()(socket.request, {}, function () {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          });
        });
      });
    });
  });

  // Add an event listener to the 'connection' event
  io.on('connection', async (socket) => {
    await Promise.all(config.sockets.map(async (socketFile) => {
      let socketPath = url.pathToFileURL(resolve(socketFile)).href;
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      await import(socketPath).then(async (socketConfig) => {
        await socketConfig.default(io, socket);
      }).catch((err) => {
        console.log(err);
      });
    }));
  });

  return server;
}
