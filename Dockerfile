FROM node:18-alpine

WORKDIR /front-polla
COPY package*.json ./

RUN apk add dumb-init \
&& yarn config set network-timeout 600000 -g \
&& yarn install --production \
&& yarn cache clean

COPY . .

EXPOSE 3000

CMD "dumb-init" "yarn" "start"