import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search,
  Warehouse,
  MapPin,
  Users,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToExcel, exportToPDF } from '../utils/export';

export default function Kandang() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama: '', lokasi: '', kapasitas: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get('/kandang');
      setData(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      'Nama Kandang': item.nama,
      Lokasi: item.lokasi,
      'Kapasitas (Ekor)': item.kapasitas
    }));
    exportToExcel(exportData, `Daftar-Kandang-${new Date().getTime()}`);
  };

  const handleExportPDF = () => {
    const headers = [['Nama Kandang', 'Lokasi', 'Kapasitas (Ekor)']];
    const body = filteredData.map(item => [
      item.nama,
      item.lokasi,
      item.kapasitas.toLocaleString()
    ]);
    exportToPDF(headers, body, `Daftar-Kandang-${new Date().getTime()}`, 'Daftar Kandang');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/kandang/${editingId}`, formData);
        toast.success('Kandang updated');
      } else {
        await axios.post('/kandang', formData);
        toast.success('Kandang created');
      }
      setModalOpen(false);
      setEditingId(null);
      setFormData({ nama: '', lokasi: '', kapasitas: 0 });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this kandang?')) {
      try {
        await axios.delete(`/kandang/${id}`);
        toast.success('Kandang deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredData = data.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kandang</h2>
          <p className="text-gray-500">Manage your farm house locations and capacity.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ nama: '', lokasi: '', kapasitas: 0 });
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-100"
        >
          <Plus className="w-5 h-5" /> Tambah Kandang
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search kandang..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
                <button 
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold hover:bg-green-100 transition-all"
                >
                    <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                >
                    <FileText className="w-4 h-4" /> PDF
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Nama Kandang</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                                <Warehouse className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-gray-900">{item.nama}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {item.lokasi}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gray-400" />
                            {item.kapasitas.toLocaleString()} Ekor
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingId(item.id);
                            setFormData({ nama: item.nama, lokasi: item.lokasi, kapasitas: item.kapasitas });
                            setModalOpen(true);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-primary-500 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Kandang' : 'Tambah Kandang'}</h3>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kandang</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Contoh: Kandang A1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                  placeholder="Contoh: Blok Timur"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kapasitas (Ekor)</label>
                <input 
                  type="number"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.kapasitas}
                  onChange={(e) => setFormData({...formData, kapasitas: parseInt(e.target.value)})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-100"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
