const pool = require('./src/config/db');

const check = async () => {
  try {
    if (pool.clientType === 'postgres') {
      const [rows] = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('Tables in PostgreSQL database:', rows.map(r => r.table_name).join(', '));
    } else {
      const [rows] = await pool.query('SHOW CREATE TABLE kandang');
      console.log('MySQL Kandang Table:\n', rows[0]['Create Table']);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
