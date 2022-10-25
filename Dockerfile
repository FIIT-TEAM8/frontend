FROM node:lts-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install 

COPY . .

ENV NODE_ENV=production

RUN npm run build

#### NGINX FOR Single Page Application ####
FROM steebchen/nginx-spa

COPY --from=build /app/build /app

WORKDIR /app

COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

RUN chmod +x env.sh

EXPOSE 80

CMD ["/bin/bash", "-c", "/app/env.sh && nginx"]