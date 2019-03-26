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
      db.disconnect(done);
    })
    .catch(function (err) {
      db.disconnect(function (disconnectError) {
        if (disconnectError) {
          console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
        }

        // Finish task with error
        done(err);
      });
    });
});
