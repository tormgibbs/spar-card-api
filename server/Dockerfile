FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["node", "dist/index.js"]
