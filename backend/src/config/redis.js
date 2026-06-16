const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

client.on('connect', () => {
  console.log('Redis connected');
});

const connect = async () => {
  await client.connect();
};

const disconnect = async () => {
  await client.disconnect();
};

const get = async (key) => {
  return await client.get(key);
};

const set = async (key, value, ttl = 3600) => {
  await client.setEx(key, ttl, JSON.stringify(value));
};

const del = async (key) => {
  await client.del(key);
};

const clear = async () => {
  await client.flushAll();
};

module.exports = { client, connect, disconnect, get, set, del, clear };
