FROM node:23-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY app/package*.json ./app/
WORKDIR /app/app
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 8080

WORKDIR /app/app
CMD ["npm", "run", "start"]
