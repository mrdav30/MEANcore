'use strict'

var path = require('path'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash');

const {
  google
} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const view_id = config.GOOGLE_VIEW_ID;


function getData(startDate, endDate, dimensions, metrics, filters, callback) {
  if (!config.GOOGLE_VIEW_ID || !config.GOOGLE_CLIENT_EMAIL || !config.GOOGLE_PRIVATE_KEY) {
    console.log('Google Analytics config not properly set');
    return callback(null, null);
  }

  var gAnalytics = google.analytics('v3');
  var authClient = new google.auth.JWT(config.GOOGLE_CLIENT_EMAIL, null, config.GOOGLE_PRIVATE_KEY, scopes);

  authClient.authorize(function (err, tokens) {
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

exports.getData = getData;
