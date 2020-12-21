FROM node:lts-alpine As development

RUN npm install -g @nrwl/cli
RUN npm install -g ts-node
RUN npm install -g typescript
RUN npm install -g tslib

RUN mkdir -p /usr/src/app/node_modules

RUN chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install --only=development --unsafe-perm

#CMD ["node", "dist/main"]
