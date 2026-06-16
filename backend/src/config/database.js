const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const query = (text, params) => {
  return pool.query(text, params);
};

const connect = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('Database connection successful');
  } finally {
    client.release();
  }
};

module.exports = { query, pool, connect };
