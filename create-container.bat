@echo off

Rem Application parameters
set SMTP_HOST=
set SMTP_PORT=
set SMTP_USER=
set SMTP_PASSWORD=
set CHRONO_JWT_TOKEN=
set NOTIFICATION_EMAL=
set JOB_CRON_EXPRESSION=0 18 1-31 * *

docker build -t fusrodah061/chrono-bot .
docker run -d ^
  --name "chrono-bot" ^
  -e SMTP_HOST ^
  -e SMTP_PORT ^
  -e SMTP_USER ^
  -e SMTP_PASSWORD ^
  -e CHRONO_JWT_TOKEN ^
  -e NOTIFICATION_EMAL ^
  -e JOB_CRON_EXPRESSION ^
  fusrodah061/chrono-bot