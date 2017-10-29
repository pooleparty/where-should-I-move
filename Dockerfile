FROM node:8.6-alpine

# reset npm loglevel (https://github.com/nodejs/docker-node/issues/57)
ENV NPM_CONFIG_LOGLEVEL warn

# export listening port
ENV PORT 3007
EXPOSE $PORT

WORKDIR /opt/code

COPY package.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
