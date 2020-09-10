import config from '../../config/config.js';

export function logError(req, res) {
  console.error(req.body);
  res.send({
    status: 'ok'
  });
}

export function logSplunkEvent(req, res) {
  const source = req.body.source,
    eventMsg = req.body.eventMsg,
    eventSev = req.body.eventSev,
    errMsg = req.body.errMsg;

  config.services.logEvent(source, eventMsg, eventSev, errMsg, () => {
    res.send({
      status: 'ok'
    });
  });
}
