require("dotenv").config(); // Ensure .env is loaded
const { Pool } = require("pg");

console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessary for self-signed certs in many cloud providers
  },
});

const connectToDB = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    console.log("Connected to Database Successfully");
    client.release();
  } catch (error) {
    console.log("Error Connecting to Database", error);
    throw error;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  connectToDB,
};
