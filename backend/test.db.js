require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("SUCCESS: Connected to Neon");
    const res = await client.query("SELECT NOW()");
    console.log(res.rows);
  } catch (err) {
    console.error("FAILED:", err);
  } finally {
    await client.end();
  }
})();
