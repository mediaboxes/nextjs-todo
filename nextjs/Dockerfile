FROM node:7.7.1

EXPOSE 3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn
COPY . /usr/src/app