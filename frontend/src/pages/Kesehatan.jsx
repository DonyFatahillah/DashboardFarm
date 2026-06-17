import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { Plus, Calendar, Clock, Check, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Kesehatan() {
  const [data, setData] = useState([]);
  const [kandang, setKandang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    kandang_id: '', 
    jenis_kegiatan: '', 
    tanggal_rencana: '',
    frekuensi: 'ONCE' // ONCE, WEEKLY, MONTHLY
  });

  const fetchData = async () => {
    try {
      const [resHealth, resKandang] = await Promise.all([
        axios.get('health'),
        axios.get('kandang')
      ]);
      setData(resHealth.data.data);
      setKandang(resKandang.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kandang_id) {
        toast.error('Pilih kandang terlebih dahulu');
        return;
    }
    try {
      await axios.post('health', formData);
      toast.success('Schedule created');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to create schedule');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jadwal Kesehatan & Vaksin</h2>
          <p className="text-gray-500">Kelola jadwal vaksinasi dan kesehatan ayam.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-600 shadow-lg"
        >
          <Plus className="w-5 h-5" /> Jadwal Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <Loader2 className="animate-spin" /> : data.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-lg uppercase">{item.status}</span>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{item.jenis_kegiatan}</h3>
            <p className="text-sm text-gray-500">Kandang: {item.nama_kandang}</p>
            <p className="text-sm font-semibold text-gray-700">Tanggal: {new Date(item.tanggal_rencana).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Modal for new schedule */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-lg">Tambah Jadwal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full p-3 border rounded-xl" required onChange={e => setFormData({...formData, kandang_id: e.target.value})}>
                <option value="">Pilih Kandang</option>
                {kandang.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
              <input type="text" placeholder="Jenis Kegiatan (Vaksin/Vitamin)" className="w-full p-3 border rounded-xl" required onChange={e => setFormData({...formData, jenis_kegiatan: e.target.value})} />
              <input type="date" className="w-full p-3 border rounded-xl" required onChange={e => setFormData({...formData, tanggal_rencana: e.target.value})} />
              <select className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, frekuensi: e.target.value})}>
                <option value="ONCE">Sekali</option>
                <option value="WEEKLY">Mingguan</option>
                <option value="MONTHLY">Bulanan</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 p-3 bg-gray-100 rounded-xl font-bold">Batal</button>
                <button type="submit" className="flex-1 p-3 bg-primary-500 text-white rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
