import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { 
  CheckCircle, 
  Calendar as CalendarIcon,
  User,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Absen() {
  const [absenList, setAbsenList] = useState([]);
  const [formData, setFormData] = useState({ 
    username: '', 
    tanggal: new Date().toISOString().split('T')[0], 
    status: 'HADIR', 
    keterangan: '' 
  });

  const fetchAbsen = async () => {
    try {
      const res = await axios.get('absen');
      setAbsenList(res.data.data);
    } catch (error) {
      toast.error('Gagal mengambil daftar hadir');
    }
  };

  useEffect(() => {
    fetchAbsen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) {
      toast.error('Masukkan nama karyawan');
      return;
    }
    
    try {
      let user_id = null;
      let nama_luar = null;

      try {
        const userRes = await axios.get(`users/search?username=${formData.username}`);
        if (userRes.data.data) {
          user_id = userRes.data.data.id;
        } else {
          nama_luar = formData.username;
        }
      } catch (error) {
        // Fallback to nama_luar if search fails (e.g. 403 for non-owners)
        nama_luar = formData.username;
      }
      
      await axios.post('absen', {
        user_id,
        nama_luar,
        tanggal: formData.tanggal,
        status: formData.status,
        keterangan: formData.keterangan
      });
      
      toast.success('Absensi berhasil dicatat');
      setFormData({ ...formData, username: '', keterangan: '' });
      fetchAbsen();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mencatat absensi');
    }
  };

  // Grouping attendance by date
  const groupedAbsen = absenList.reduce((acc, curr) => {
    const date = new Date(curr.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Absensi Karyawan</h2>
        <p className="text-gray-500">Rekap kehadiran harian karyawan.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-lg mb-2">Input Absensi</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Karyawan</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Masukkan nama"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
              <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                  <option value="HADIR">HADIR</option>
                  <option value="IZIN">IZIN</option>
                  <option value="SAKIT">SAKIT</option>
                  <option value="ALPHA">ALPHA</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg"
            >
              <CheckCircle className="w-5 h-5" /> Simpan
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <List className="w-5 h-5" /> Daftar Hadir
            </h3>
            {Object.keys(groupedAbsen).length === 0 && <p className="text-gray-500">Belum ada data hadir.</p>}
            {Object.keys(groupedAbsen).map(date => (
                <div key={date} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary-500" /> {date}
                    </h4>
                    <div className="space-y-2">
                        {groupedAbsen[date].map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="font-semibold">{item.username}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    item.status === 'HADIR' ? 'bg-green-100 text-green-700' :
                                    item.status === 'IZIN' ? 'bg-yellow-100 text-yellow-700' :
                                    item.status === 'SAKIT' ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                }`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
