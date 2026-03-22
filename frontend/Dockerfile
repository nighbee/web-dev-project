FROM node:22-alpine

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app/

EXPOSE 4200

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
