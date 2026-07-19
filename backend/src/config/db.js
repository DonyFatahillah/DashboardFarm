const { Pool } = require('pg');
require('dotenv').config();

const dbClient = process.env.DB_CLIENT || 'mysql'; // Default to mysql if not set

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || (dbClient === 'postgres' ? 5432 : 3306),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
};

console.log(`Attempting to connect to ${dbClient} database ${dbConfig.database} at ${dbConfig.host}`);

let queryWrapper;

if (dbClient === 'postgres') {
  const pool = new Pool(dbConfig);
  queryWrapper = {
    query: async (text, params) => {
      if (text && typeof text === 'string') {
        let i = 1;
        text = text.replace(/\?/g, () => `$${i++}`);
        if (/^\s*INSERT\s+INTO/i.test(text) && !/\bRETURNING\b/i.test(text)) {
           text += ' RETURNING id';
        }
      }
      try {
        const res = await pool.query(text, params);
        if (['INSERT', 'UPDATE', 'DELETE'].includes(res.command)) {
          return [{ affectedRows: res.rowCount, insertId: res.rows && res.rows.length > 0 ? res.rows[0].id : null }, res.fields];
        }
        return [res.rows, res.fields];
      } catch (err) {
        console.error('Postgres query error:', err.message, '\nQuery:', text);
        throw err;
      }
    },
    end: () => pool.end(),
    clientType: 'postgres'
  };
} else {
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  queryWrapper = {
    query: async (text, params) => pool.query(text, params),
    end: () => pool.end(),
    clientType: 'mysql'
  };
}

module.exports = queryWrapper;
