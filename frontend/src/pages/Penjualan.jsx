import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { Plus, Calendar, ShoppingCart, User, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Penjualan() {
  const [dataTelur, setDataTelur] = useState([]);
  const [dataPupuk, setDataPupuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('TELUR'); // TELUR | PUPUK
  const [formData, setFormData] = useState({ 
    tanggal: new Date().toISOString().split('T')[0], 
    pembeli: '', 
    jumlah: 0,
    harga: 0,
    total: 0
  });

  const fetchData = async () => {
    try {
      const [resTelur, resPupuk] = await Promise.all([
        axios.get('penjualan'),
        axios.get('pupuk')
      ]);
      setDataTelur(resTelur.data.data);
      setDataPupuk(resPupuk.data.data);
    } catch (error) {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, total: prev.jumlah * prev.harga }));
  }, [formData.jumlah, formData.harga]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'TELUR') {
        await axios.post('penjualan', {
          tanggal: formData.tanggal,
          pembeli: formData.pembeli,
          jumlah_kg: parseFloat(formData.jumlah),
          harga_per_kg: parseFloat(formData.harga),
          total_harga: parseFloat(formData.total)
        });
      } else {
        await axios.post('pupuk', {
          tanggal: formData.tanggal,
          pembeli: formData.pembeli,
          jumlah_karung: parseInt(formData.jumlah),
          harga_per_karung: parseFloat(formData.harga),
          total_harga: parseFloat(formData.total)
        });
      }
      toast.success('Data berhasil disimpan');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const groupedData = [...dataTelur.map(d => ({...d, type: 'TELUR'})), ...dataPupuk.map(d => ({...d, type: 'PUPUK'}))].reduce((acc, curr) => {
    const date = new Date(curr.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modul Penjualan</h2>
          <p className="text-gray-500">Kelola penjualan telur dan pupuk.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700">
          <Plus className="w-5 h-5" /> Catat Penjualan
        </button>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedData).map(date => (
          <div key={date} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedData[date].map(item => (
                <div key={`${item.type}-${item.id}`} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-700">{item.pembeli}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.type === 'TELUR' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span>
                    </div>
                    <p className="text-sm font-semibold text-primary-600">Rp {item.total_harga.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">{item.type === 'TELUR' ? `${item.jumlah_kg} kg` : `${item.jumlah_karung} karung`}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex gap-2">
                <button onClick={() => setActiveTab('TELUR')} className={`flex-1 p-2 rounded-lg font-bold ${activeTab === 'TELUR' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>Telur</button>
                <button onClick={() => setActiveTab('PUPUK')} className={`flex-1 p-2 rounded-lg font-bold ${activeTab === 'PUPUK' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Pupuk</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="date" required className="w-full p-3 border rounded-xl" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                <input type="text" placeholder="Nama Pembeli" required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, pembeli: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder={activeTab === 'TELUR' ? 'Jumlah (kg)' : 'Karung'} required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, jumlah: e.target.value})} />
                    <input type="number" placeholder="Harga/unit" required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, harga: e.target.value})} />
                </div>
                <div className="bg-gray-50 p-3 rounded-xl font-bold">Total: Rp {formData.total.toLocaleString('id-ID')}</div>
                <button type="submit" className="w-full p-3 bg-primary-600 text-white rounded-xl font-bold">Simpan Penjualan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}