const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const kandangSchema = z.object({
  nama: z.string().min(1),
  lokasi: z.string().min(1),
  kapasitas: z.number().int().positive(),
});

const produksiSchema = z.object({
  kandang_id: z.number().int().positive(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  jumlah_telur: z.number().int().nonnegative(),
  berat_telur: z.number().positive(),
});

const kematianSchema = z.object({
  kandang_id: z.number().int().positive(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  jumlah_mati: z.number().int().nonnegative(),
  penyebab: z.string().optional(),
});

const pakanSchema = z.object({
  kandang_id: z.number().int().positive(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  jenis_pakan: z.string().min(1),
  jumlah_kg: z.number().positive(),
});

const penjualanSchema = z.object({
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  pembeli: z.string().min(1),
  jumlah_kg: z.number().positive(),
  harga_per_kg: z.number().positive(),
  total_harga: z.number().positive(),
});

const userCreateSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['OWNER', 'MANAGER', 'STAFF']),
  kandang_id: z.number().int().positive().nullable().optional(),
});

module.exports = {
  loginSchema,
  kandangSchema,
  produksiSchema,
  kematianSchema,
  pakanSchema,
  penjualanSchema,
  userCreateSchema,
};
