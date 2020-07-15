# Chrono.gg Bot

Script used to automate the daily coin flipping feature on [Chrono.gg](https://www.chrono.gg/). Run it as a cron job.

## Requirements

- Cron

`.env` properties:

- `SMTP_HOST`: SMTP host used for sending notification emails (eg. `smtp.gmail.com`).

- `SMTP_PORT`: SMTP host port (`smtp.gmail.com` uses port 465).

- `SMTP_USER`: SMTP user.

- `SMTP_PASSWORD`: SMTP user password.

- `CHRONO_JWT_TOKEN`: Chrono.gg auth token. Use your browser's network inspector to locate it.

- `NOTIFICATION_EMAL`: Email address to send notifications to.

- `LOG_DIRECTORY`: Directory where the application will store log files. Must exist and be writeable.

- `LOG_FILENAME_PATTERN`: Log file name pattern. Use [simple-node-logger](https://www.npmjs.com/package/simple-node-logger) patterns.

## Deploying

[Setup a cron job](https://www.geeksforgeeks.org/how-to-setup-cron-jobs-in-ubuntu/) to periodically run `cron-job-runner.sh`:

`0 15 1-31 * * ~/chrono_bot/cron-job-runner.sh`

Make the file `cron-job-runner.sh` executable by running `chmod +x cron-job-runner.sh`, or add `/bin/sh` when creating the job:

`0 15 1-31 * * /bin/sh ~/chrono_bot/cron-job-runner.sh`

Chrono.gg coin flips reset everyday at 9:00 AM Pacific time.

Job setup may vary on your environment.

To check if the job is set, run and look for the created job:

`grep CRON /var/log/syslog`
