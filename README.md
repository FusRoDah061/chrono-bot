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

## Deploying

[Setup a cron job](https://www.geeksforgeeks.org/how-to-setup-cron-jobs-in-ubuntu/) to periodically run `cron-job-runner.sh`:

`*/10 * * * * ~/chrono_bot/cron-job-runner.sh`

Make the file `cron-job-runner.sh` executable by running `chmod +x cron-job-runner.sh`, or add `/bin/sh` when creating the job:

`*/10 * * * * /bin/sh ~/chrono_bot/cron-job-runner.sh`

Job setup may vary on your environment.

To check if the job is set, run and look for the created job:

`grep CRON /var/log/syslog`
