#!/bin/bash
set -x 

docker stop chrono-bot

docker container rm chrono-bot

docker image rm fusrodah061/chrono-bot

set +x 

/bin/bash linux/create-container.sh