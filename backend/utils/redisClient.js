import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL, {
    tls: process.env.NODE_ENV === "production" ? {} : undefined, // required for Upstash/Render SSL
});

export { client };
