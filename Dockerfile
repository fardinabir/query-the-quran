FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY public/ ./public/
RUN mkdir -p uploads

COPY uploads/sample_verses.csv ./uploads/

EXPOSE 3000

CMD ["node", "src/app.js"]