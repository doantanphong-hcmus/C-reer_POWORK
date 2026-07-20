FROM node:20-bookworm AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

FROM node:20-bookworm

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app ./

EXPOSE 3001

CMD ["npm", "start"]
