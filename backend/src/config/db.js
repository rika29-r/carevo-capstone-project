const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isNeon =
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.includes("neon.tech");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Neon wajib SSL
  ssl: isNeon || isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err.message);
});

module.exports = pool;