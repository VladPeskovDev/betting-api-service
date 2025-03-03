FROM node:20-alpine3.17


WORKDIR /app


COPY package.json pnpm-lock.yaml ./


RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile


COPY . .


ENV DATABASE_URL=$DATABASE_URL
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
ENV REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
ENV BETTING_API_URL=$BETTING_API_URL
ENV PORT=3000


RUN pnpm prisma generate


RUN pnpm run build && ls -la dist  # Проверяем, что dist/ появился


EXPOSE 3000


CMD pnpm prisma migrate deploy && pnpm ts-node prisma/seed.ts && node dist/src/server.js
