import config from '../../config/config.js';
import _ from 'lodash';

import googleapis from 'googleapis';
const {
  google
} = googleapis;

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const view_id = config.GOOGLE_VIEW_ID;


export function getData(startDate, endDate, dimensions, metrics, filters, callback) {
  if (!config.GOOGLE_VIEW_ID || !config.GOOGLE_CLIENT_EMAIL || !config.GOOGLE_PRIVATE_KEY) {
    console.log('Google Analytics config not properly set');
    return callback(null, null);
  }

  var gAnalytics = google.analytics('v3');
  var authClient = new google.auth.JWT(config.GOOGLE_CLIENT_EMAIL, null, config.GOOGLE_PRIVATE_KEY, scopes);

  authClient.authorize(function (err) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    var params = {
      'auth': authClient,
      'ids': 'ga:' + view_id,
      'start-date': startDate,
      'end-date': endDate,
      'dimensions': dimensions,
      'metrics': metrics,
      'filters': filters
    }

    gAnalytics.data.ga.get(params, function (err, response) {
      if (err) {
        console.log(err);
        return callback(err);
      }

      var data = response.data ? response.data : [];

      // map column headers to data rows
      var result = _.map(data.rows, function (row) {
        var rowdoc = {};
        for (var i = 0; i < data.columnHeaders.length; i++) {
          var name = _.replace(data.columnHeaders[i].name, /^ga:/, '');
          rowdoc[name] = row[i];
        }
        return rowdoc;
      })

      callback(null, result);
    });
  });
}
