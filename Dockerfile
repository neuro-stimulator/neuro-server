FROM node:lts-alpine As development

RUN npm install -g @nrwl/cli
RUN npm install -g typescript@4.0.3
RUN npm install -g ts-node@9.0.0
RUN npm install -g tslib@2.0.1

RUN mkdir -p /usr/src/app/node_modules

RUN chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install --only=development --unsafe-perm

#CMD ["node", "dist/main"]
