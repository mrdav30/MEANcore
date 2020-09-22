import got from 'got';

export const logEvent = (config, source, eventMsg, eventSev, errMsg, cbMain) => {
    return logExtEvent(config, source, eventMsg, eventSev, errMsg, null, cbMain);
}

export const logExtEvent = (config, source, eventMsg, eventSev, errMsg, evData, cbMain) => {
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
    got.post(config.splunkUrl, {
        form: event,
        headers: {
            "Authorization": "Splunk " + config.splunkToken
        }
    }, (err) => {
        if (err) {
            console.error(err);
            cbMain(err);
        } else {
            cbMain(null);
        }
    });
}
