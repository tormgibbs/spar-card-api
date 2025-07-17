import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const redisOptions = {
  host: redisHost,
  port: redisPort,
};

export const redis = new Redis(redisOptions);
export const pub = new Redis(redisOptions);
export const sub = new Redis(redisOptions);

