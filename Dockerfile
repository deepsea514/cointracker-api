FROM node:16.20.2-alpine3.18

WORKDIR /usr/apps

ADD . .

RUN apk add git

RUN npm i

EXPOSE 3000

CMD npm start