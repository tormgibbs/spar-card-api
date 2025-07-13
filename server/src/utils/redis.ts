import Redis from "ioredis";

export const redis = new Redis();
export const pub = new Redis();
export const sub = new Redis();
