'use strict'

var path = require('path'),
    config = require(path.resolve('./config/config')),
    _ = require('lodash');

const {
    google
} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const view_id = config.app.GOOGLE_VIEW_ID;


function getData(startDate, endDate, dimensions, metrics, filters, callback) {
    var gAnalytics = google.analytics('v3');
    var authClient = new google.auth.JWT(config.app.GOOGLE_CLIENT_EMAIL, null, config.app.GOOGLE_PRIVATE_KEY, scopes);

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
                    var name = data.columnHeaders[i].name.replace(/^ga:/, '');
                    rowdoc[name] = row[i];
                }
                return rowdoc;
            })

            callback(null, result);
        });
    });
}

exports.getData = getData;