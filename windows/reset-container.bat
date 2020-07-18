@echo off

docker stop chrono-bot

docker container rm chrono-bot

docker image rm fusrodah061/chrono-bot

windows\create-container.bat