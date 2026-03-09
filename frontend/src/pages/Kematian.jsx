import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { Plus, Loader2, Calendar, Skull, Warehouse } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Kematian() {
  const [data, setData] = useState([]);
  const [kandangs, setKandangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    kandang_id: '', 
    tanggal: new Date().toISOString().split('T')[0], 
    jumlah_mati: 0, 
    penyebab: '' 
  });
  const [filters, setFilters] = useState({ kandang_id: '', start: '', end: '' });

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const [res, kandangRes] = await Promise.all([
        axios.get(`/kematian?${query}`),
        axios.get('/kandang')
      ]);
      setData(res.data.data);
      setKandangs(kandangRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/kematian', {
        ...formData,
        kandang_id: parseInt(formData.kandang_id),
        jumlah_mati: parseInt(formData.jumlah_mati)
      });
      toast.success('Record saved');
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
          <h2 className="text-2xl font-bold text-gray-900">Kematian Harian</h2>
          <p className="text-gray-500">Track and monitor daily mortality rate.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-danger-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-danger-700 transition-all shadow-lg shadow-danger-100"
        >
          <Plus className="w-5 h-5" /> Catat Kematian
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kandang</label>
          <select 
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            value={filters.kandang_id}
            onChange={(e) => setFilters({...filters, kandang_id: e.target.value})}
          >
            <option value="">Semua Kandang</option>
            {kandangs.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
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
                <th className="px-6 py-4">Kandang</th>
                <th className="px-6 py-4 text-center">Jumlah Mati</th>
                <th className="px-6 py-4">Penyebab</th>
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
                  <tr key={item.id} className="hover:bg-danger-50/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{item.nama_kandang}</td>
                    <td className="px-6 py-4 text-center font-bold text-danger-600">{item.jumlah_mati}</td>
                    <td className="px-6 py-4 text-gray-600">{item.penyebab || '-'}</td>
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
            <div className="bg-danger-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">Catat Kematian</h3>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kandang</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-danger-500"
                  value={formData.kandang_id}
                  onChange={(e) => setFormData({...formData, kandang_id: e.target.value})}
                >
                  <option value="">Pilih Kandang</option>
                  {kandangs.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-danger-500"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Mati (Ekor)</label>
                <input 
                  type="number"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-danger-500"
                  value={formData.jumlah_mati}
                  onChange={(e) => setFormData({...formData, jumlah_mati: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Penyebab</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-danger-500"
                  value={formData.penyebab}
                  onChange={(e) => setFormData({...formData, penyebab: e.target.value})}
                  placeholder="Contoh: Sakit, Stress, dll"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-danger-600 text-white font-bold rounded-xl hover:bg-danger-700 shadow-lg shadow-danger-100">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
