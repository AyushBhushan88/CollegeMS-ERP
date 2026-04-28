FROM node:20-slim AS builder

WORKDIR /app

RUN npm install -g pnpm turbo

COPY . .

RUN pnpm install
RUN turbo build --filter=finance-service...

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/finance-service/dist ./services/finance-service/dist
COPY --from=builder /app/services/finance-service/package.json ./services/finance-service/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 3003

CMD ["node", "services/finance-service/dist/main"]
