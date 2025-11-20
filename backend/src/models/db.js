// src/models/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Log URL to confirm loaded correctly
console.log("DATABASE_URL =", process.env.DATABASE_URL);

// Create pool (works with Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },   // Required for Neon
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.connect()
  .then(() => console.log("✓ Connected to database"))
  .catch(err => console.error("✗ Database connection error:", err.message));

// Query helper
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Query Error:", err.message);
    throw err;
  }
}

module.exports = {
  query,
  pool
};
