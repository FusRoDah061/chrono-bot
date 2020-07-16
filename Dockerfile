FROM node:10-alpine

WORKDIR /app

RUN apk add git; \
    git clone https://github.com/FusRoDah061/chrono-bot.git; \
    cd chrono-bot; \
    npm install

WORKDIR /app/chrono-bot

ENTRYPOINT node app