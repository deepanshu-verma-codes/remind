const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

const reminderQueue = new Queue("reminderQueue", {
  connection: redisConnection,
});

module.exports = { reminderQueue, redisConnection };
