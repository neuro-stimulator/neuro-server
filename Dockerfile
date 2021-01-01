FROM node:lts-alpine As development

RUN apk add --no-cache make gcc g++ python linux-headers udev

RUN mkdir -p /usr/src/stimulator-backend/node_modules

RUN chown -R node:node /usr/src/stimulator-backend

USER node

WORKDIR /usr/src/stimulator-backend

COPY --chown=node:node . .

RUN npm install --unsafe-perm

CMD ["/bin/sh"]
