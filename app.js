const cron = require('node-cron');
const job = require('./job');
const log = require('./logger').getLogger('app');

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