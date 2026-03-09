import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { Plus, Loader2, Calendar, ShoppingCart, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Penjualan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    tanggal: new Date().toISOString().split('T')[0], 
    pembeli: '', 
    jumlah_kg: 0,
    harga_per_kg: 0,
    total_harga: 0
  });
  const [filters, setFilters] = useState({ start: '', end: '' });

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/penjualan?${query}`);
      setData(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    setFormData(prev => ({
        ...prev,
        total_harga: prev.jumlah_kg * prev.harga_per_kg
    }));
  }, [formData.jumlah_kg, formData.harga_per_kg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/penjualan', {
        ...formData,
        jumlah_kg: parseFloat(formData.jumlah_kg),
        harga_per_kg: parseFloat(formData.harga_per_kg),
        total_harga: parseFloat(formData.total_harga)
      });
      toast.success('Sales recorded');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Penjualan Telur</h2>
          <p className="text-gray-500">Track your sales revenue and customers.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-success-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-success-700 transition-all shadow-lg shadow-success-100"
        >
          <Plus className="w-5 h-5" /> Catat Penjualan
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="w-full md:w-40">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dari</label>
          <input 
            type="date"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={filters.start}
            onChange={(e) => setFilters({...filters, start: e.target.value})}
          />
        </div>
        <div className="w-full md:w-40">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sampai</label>
          <input 
            type="date"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={filters.end}
            onChange={(e) => setFilters({...filters, end: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Pembeli</th>
                <th className="px-6 py-4 text-center">Jumlah (KG)</th>
                <th className="px-6 py-4 text-right">Total Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No records found</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-success-50/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{item.pembeli}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.jumlah_kg} kg</td>
                    <td className="px-6 py-4 text-right font-bold text-success-600">Rp {item.total_harga.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-success-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">Catat Penjualan</h3>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-success-500"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pembeli</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-success-500"
                  value={formData.pembeli}
                  onChange={(e) => setFormData({...formData, pembeli: e.target.value})}
                  placeholder="Contoh: Toko Berkah"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah (KG)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-success-500"
                    value={formData.jumlah_kg}
                    onChange={(e) => setFormData({...formData, jumlah_kg: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga / KG</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-success-500"
                    value={formData.harga_per_kg}
                    onChange={(e) => setFormData({...formData, harga_per_kg: e.target.value})}
                  />
                </div>
              </div>
              <div className="bg-success-50 p-4 rounded-xl">
                 <p className="text-xs text-success-600 font-bold uppercase mb-1">Total Pendapatan</p>
                 <p className="text-2xl font-bold text-success-700">Rp {formData.total_harga.toLocaleString('id-ID')}</p>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-success-600 text-white font-bold rounded-xl hover:bg-success-700 shadow-lg shadow-success-100">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
