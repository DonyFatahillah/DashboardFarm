const pool = require('./src/config/db');

const seedSamples = async () => {
  try {
    console.log('Inserting sample data...');

    // Sample Kandang
    const [kandangResult] = await pool.query(
      'INSERT INTO kandang (nama, lokasi, kapasitas) VALUES (?, ?, ?), (?, ?, ?)',
      ['Kandang A', 'Sisi Utara', 1000, 'Kandang B', 'Sisi Selatan', 1200]
    );
    const kandangAId = kandangResult.insertId;
    const kandangBId = kandangResult.insertId + 1;
    console.log('Sample kandangs created.');

    // Sample Batch Ayam
    await pool.query(
      'INSERT INTO batch_ayam (kandang_id, tanggal_masuk, jumlah_awal, keterangan) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
      [kandangAId, '2026-01-01', 1000, 'Batch Januari 2026', kandangBId, '2026-02-01', 1200, 'Batch Februari 2026']
    );
    console.log('Sample batches created.');

    // Sample Produksi
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'INSERT INTO produksi_harian (kandang_id, tanggal, jumlah_telur, berat_telur) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
      [kandangAId, today, 850, 52.5, kandangBId, today, 980, 60.2]
    );
    console.log('Sample production created.');

    console.log('Sample data insertion completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
};

seedSamples();
