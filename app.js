const cron = require('node-cron');
const job = require('./job');
const log = require('./logger').getLogger('app');

log.info('Environment:');
log.info('SMTP_HOST=', process.env.SMTP_HOST);
log.info('SMTP_PORT=', process.env.SMTP_PORT);
log.info('SMTP_USER=', process.env.SMTP_USER);
log.info('SMTP_PASSWORD=', process.env.SMTP_PASSWORD);
log.info('CHRONO_JWT_TOKEN=', process.env.CHRONO_JWT_TOKEN);
log.info('NOTIFICATION_EMAL=', process.env.NOTIFICATION_EMAL);
log.info('JOB_CRON_EXPRESSION=', process.env.JOB_CRON_EXPRESSION);


if(!process.env.JOB_CRON_EXPRESSION) {
  log.info('Not scheduling job execution: JOB_CRON_EXPRESSION not set.');
}
else {
  cron.schedule(process.env.JOB_CRON_EXPRESSION, async function (){
    log.info('Starting job execution.');
  
    try {
      await job.run();
    } 
    catch(err) {
      log.error('Execution error: ', err);
    }
    
    log.info('Finishing job execution.');
  });
}