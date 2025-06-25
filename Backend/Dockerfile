FROM node:22-slim AS build

RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY src /app/src
COPY package.json /app
COPY tsconfig.json /app

WORKDIR /app

EXPOSE 3000

RUN npm install

CMD [ "npm", "run", "dev" ]