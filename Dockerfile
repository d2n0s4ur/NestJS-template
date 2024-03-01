FROM node:21 As development
WORKDIR /usr/src/app

COPY package*.json ./
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm_config_arch=x64 npm_config_platform=linux yarn add sharp@0.32.6
RUN yarn install --check-files
COPY . .

RUN yarn build

FROM node:21-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]