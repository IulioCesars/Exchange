FROM node:15.14.0-alpine3.13

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

ADD . .

RUN npm run build
CMD ["npm", "run", "exec"]