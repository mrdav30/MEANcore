export const logError = (req, res) => {
  console.error(req.body);
  res.send({
    status: 'ok'
  });
}

export const logSplunkEvent = (req, res) => {
  const config = req.app.locals.config;
  const source = req.body.source,
    eventMsg = req.body.eventMsg,
    eventSev = req.body.eventSev,
    errMsg = req.body.errMsg;

  config.services.logEvent(config, source, eventMsg, eventSev, errMsg, () => {
    res.send({
      status: 'ok'
    });
  });
}
