#!/bin/bash

# Application parameters
export SMTP_HOST=
export SMTP_PORT=
export SMTP_USER=
export SMTP_PASSWORD=
export CHRONO_JWT_TOKEN=
export NOTIFICATION_EMAL=
export JOB_CRON_EXPRESSION=

set -x 

docker build -t fusrodah061/chrono-bot .
docker run -d \
  --name "chrono-bot" \
  -e SMTP_HOST \
  -e SMTP_PORT \
  -e SMTP_USER \
  -e SMTP_PASSWORD \
  -e CHRONO_JWT_TOKEN \
  -e NOTIFICATION_EMAL \
  -e JOB_CRON_EXPRESSION \
  fusrodah061/chrono-bot
  
set +x 