# FROM node:20-slim
FROM node:18.17.0-alpine
COPY package*.json ./
RUN npm install 
COPY . .
CMD npm start
