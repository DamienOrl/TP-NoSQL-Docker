FROM node:alpine

RUN apt update
RUN apt install nano
RUN apt install npm
RUN npm install --save ioredis
RUN docker run -p 6379:6379 --name=redis-srv --rm redis

ADD . ./app/app

RUN npm install

EXPOSE 6379
CMD npm run watch
