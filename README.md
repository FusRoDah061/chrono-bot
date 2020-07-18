# Chrono.gg Bot

Program used to automate the daily coin flipping feature on [Chrono.gg](https://www.chrono.gg/).

## Requirements

- Docker

### Environment properties:

Set these values within the `create-container` script for your platform (Windows or Linux).

- `SMTP_HOST`: SMTP host used for sending notification emails (eg. `smtp.gmail.com`).

- `SMTP_PORT`: SMTP host port (`smtp.gmail.com` uses port 465).

- `SMTP_USER`: SMTP user.

- `SMTP_PASSWORD`: SMTP user password.

- `CHRONO_JWT_TOKEN`: Chrono.gg auth token. Use your browser's network inspector to locate it.

- `NOTIFICATION_EMAL`: Email address to send notifications to.

- `JOB_CRON_EXPRESSION`: Cron expression indicating the frequency in which the job will run. Chrono.gg coin flips reset everyday at 9:00 AM Pacific time.

## Deploying

Before starting the application, make sure to configure the environment params shown above.

To deploy, simply run the `create-container` script for your platform. This must be run from the same folder where the Dockerfile is located.

### Windows

Run `windows\create-container.bat` at a terminal window. This will build the Dockerfile and start a container with the application.

If you need to change any of the environment params, use `windows\reset-container.bat` to recreate the container with the new values.

### Linux

Run `linux\create-container.sh` at a terminal window. This will build the Dockerfile and start a container with the application.

If you need to change any of the environment params, use `linux\reset-container.sh` to recreate the container with the new values.