const { Client } = require('pg');
const connectionString = "postgresql://postgres.lhirqufrruxeolsywsvf:Abdullah.Abdullah0101@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    console.log("Connecting to Supabase...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Current time from DB:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error details:", err);
  }
}

testConnection();
