FROM node:8.11.2

# reset npm loglevel (https://github.com/nodejs/docker-node/issues/57)
ENV NPM_CONFIG_LOGLEVEL warn

# export listening port
ENV PORT 3001
EXPOSE $PORT

WORKDIR /opt/code

COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN npm run build

CMD ["npm", "start"]
