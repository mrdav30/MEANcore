import config from '../config.js';
import url from 'url';
import agenda from 'agenda';

export function startTaskScheduler(mongoInstance) {
  return new Promise((resolve) => {
    // or override the default collection name:
    let _agenda = new agenda({
      mongo: mongoInstance.db
    });

    const jobTypes = config.agenda && config.agenda.JOB_TYPES ? config.agenda.JOB_TYPES.split(',') : [];
    jobTypes.forEach(async (type) => {
      const jobPath = url.fileURLToPath('./jobs/' + type);
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      await import(jobPath).then(async (job) => {
        job.default(_agenda);
      });
    });

    if (jobTypes.length) {
      _agenda.on('ready', async () => {
        await _agenda.start();

        config.agenda.DEFAULT_JOBS.forEach((data) => {
          this.scheduleUniqueJob(_agenda, data);
        });

        return resolve(_agenda);
      });
    }

    async function graceful() {
      await _agenda.stop(function () {
        // eslint-disable-next-line no-process-exit
        process.exit(0);
      });
    }

    process.on('SIGTERM', graceful);
    process.on('SIGINT', graceful);
  });
}

export function scheduleUniqueJob(agenda, data) {
  let job = agenda.create(data.jobName, {
    appName: config.app.name
  });
  job.schedule(data.schedule);
  if (data.repeat) {
    job.repeatAt(data.repeatInterval)
  }
  job.unique({
    'data.appName': config.app.name
  });
  job.save();
}
