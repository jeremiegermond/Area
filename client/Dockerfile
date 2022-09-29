# syntax=docker/dockerfile:1

FROM node
EXPOSE 8081
ENV NODE_ENV=development
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --development
COPY . .
RUN npm start