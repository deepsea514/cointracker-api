FROM node:16.5-alpine

WORKDIR /usr/apps

ADD . .

RUN apk add git

RUN npm i

EXPOSE 3000

CMD npm start