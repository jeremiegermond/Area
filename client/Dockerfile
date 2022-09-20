# syntax=docker/dockerfile:1

FROM node
EXPOSE 8081
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "npm", "start" ]
