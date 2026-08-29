import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Supabase (and most hosted Postgres) require SSL. Local connections
// (localhost/127.0.0.1) don't need it, so only enable it otherwise.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
