FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN pnpm build

CMD ["node", "dist/index.js"]
