const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Many cloud providers (Aiven, DigitalOcean, PlanetScale) require SSL
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
};

console.log(`Attempting to connect to database ${dbConfig.database} at ${dbConfig.host}`);

const pool = mysql.createPool(dbConfig);

module.exports = pool;
