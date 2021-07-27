FROM node:alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
RUN npm i
COPY src src

CMD npm run dev