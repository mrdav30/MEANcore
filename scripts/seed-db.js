import 'dotenv/config.js';

import { connect, loadModels, disconnect } from '../config/lib/mongoose-manager.js';
import { start } from '../config/lib/mongo-seed';

// Open mongoose database connection
connect(async () => {
  loadModels();

  start({
      options: {
        logResults: true
      }
    })
    .then(function () {
      // Disconnect and finish task
      disconnect((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database.');
          // Finish task with error
          console.error(disconnectError);
        }
      });
    })
    .catch((err) => {
      disconnect((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
        }

        // Finish task with error
        console.error(err);
      });
    });
});
