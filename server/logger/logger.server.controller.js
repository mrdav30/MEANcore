var path = require('path');
var logger = require(path.resolve('./server/services/splunk-logger.service.js'));
var loggerController = {};

loggerController.logError = function (req, res) {
    console.error(req.body);
    res.send({
        status: 'ok'
    });
};

loggerController.logSplunkEvent = function (req, res) {
    var source = req.body.source,
        eventMsg = req.body.eventMsg,
        eventSev = req.body.eventSev,
        errMsg = req.body.errMsg;

    logger.logEvent(source, eventMsg, eventSev, errMsg, () => {
        res.send({
            status: 'ok'
        });
    });
};

module.exports = loggerController;