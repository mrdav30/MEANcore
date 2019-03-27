require('dotenv').config();

const db = require('../config/lib/mongoose');
const seed = require('../config/lib/mongo-seed');

// Open mongoose database connection
db.connect(async () => {
  db.loadModels();

  seed
    .start({
      options: {
        logResults: true
      }
    })
    .then(function () {
      // Disconnect and finish task
      db.disconnect((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database.');
          // Finish task with error
          console.error(disconnectError);
        }
      });
    })
    .catch((err) => {
      db.disconnect((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
        }

        // Finish task with error
        console.error(err);
      });
    });
});
