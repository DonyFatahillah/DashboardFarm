const pool = require('./src/config/db');

const check = async () => {
  try {
    const [rows] = await pool.query('SHOW CREATE TABLE kandang');
    console.log(rows[0]['Create Table']);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
