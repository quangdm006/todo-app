FROM node:20-alpine

RUN adduser -D todo

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN chown -R todo:todo /app

USER todo

EXPOSE 3000

CMD ["npm", "run", "dev"]
