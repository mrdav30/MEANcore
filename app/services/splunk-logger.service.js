var path = require('path'),
    config = require(path.resolve('./config/config')),
    request = require('request');

exports.logEvent = function(source, eventMsg, eventSev, errMsg, cbMain) {
    return logExtEvent(source, eventMsg, eventSev, errMsg, null, cbMain);
}

exports.logExtEvent = function(source, eventMsg, eventSev, errMsg, evData, cbMain) {
    var event = {
        "source": source + ' - ' + config.dbtype,
        "event": {
            "message": eventMsg,
            "severity": eventSev,
            "stack-trace": errMsg
        }
    };
    if (evData) event["event"]["event-data"] = evData;
    event = JSON.stringify(event);
    request({
        url: config.splunkUrl,
        method: 'POST',
        form: event,
        headers: {
            "Authorization": "Splunk " + config.splunkToken
        }
    }, function callback(err, httpResponse, body) {
        if (err) {
            console.error(err);
            cbMain(err);
        } else {
            cbMain(null);
        };
    });
}