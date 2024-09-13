const { Pool } = require("pg");

const pool = new Pool();

connectToDB = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    console.log("Connected to Database Successfully")
    client.release();
  } catch (error) {
    console.log("Error Connecting to Database", error);
    throw error
  }
};


module.exports = {
  query: (text, params) => pool.query(text, params),
  connectToDB
};
