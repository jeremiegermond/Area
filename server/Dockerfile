# syntax=docker/dockerfile:1

FROM node
ENV NODE_ENV=development
ENV PORT=8080
EXPOSE $PORT
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --development
COPY . .
CMD [ "npm", "start" ]
