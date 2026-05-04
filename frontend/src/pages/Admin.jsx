import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { 
  Plus, 
  Loader2, 
  Search,
  User,
  Shield,
  Warehouse,
  Key,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const [data, setData] = useState([]);
  const [kandangList, setKandangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'STAFF', 
    kandang_id: '',
    isAdmin: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, kandangRes] = await Promise.all([
        axios.get('/users'),
        axios.get('/kandang')
      ]);
      setData(usersRes.data.data);
      setKandangList(kandangRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        username: formData.username,
        password: formData.password,
        role: formData.isAdmin ? 'OWNER' : formData.role,
        kandang_id: formData.isAdmin ? null : (formData.kandang_id ? parseInt(formData.kandang_id) : null)
      };

      await axios.post('/users', payload);
      toast.success('User created successfully');
      setModalOpen(false);
      setFormData({ username: '', password: '', role: 'STAFF', kandang_id: '', isAdmin: false });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const filteredData = data.filter(item => 
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-gray-500">Manage system users and their access roles.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ username: '', password: '', role: 'STAFF', kandang_id: '', isAdmin: false });
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-100"
        >
          <Plus className="w-5 h-5" /> Tambah Pengguna
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assign Kandang</th>
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
                    No users found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                                {item.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{item.username}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-bold",
                                item.role === 'OWNER' ? "bg-purple-100 text-purple-700" :
                                item.role === 'MANAGER' ? "bg-blue-100 text-blue-700" :
                                "bg-gray-100 text-gray-700"
                            )}>
                                {item.role === 'OWNER' ? 'ADMIN' : item.role}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Warehouse className="w-4 h-4 text-gray-400" />
                            {item.kandang_nama || 'All Access'}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.id !== currentUser.id ? (
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group-hover:scale-110"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md italic">You</span>
                      )}
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
              <h3 className="font-bold text-lg">Tambah Pengguna Baru</h3>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Enter username"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Min 6 characters"
                    />
                </div>
              </div>
              
              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox"
                  id="isAdmin"
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
                />
                <label htmlFor="isAdmin" className="text-sm font-semibold text-gray-700">Set as Admin (Full Access)</label>
              </div>

              {!formData.isAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <select 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="STAFF">STAFF</option>
                        <option value="MANAGER">MANAGER</option>
                    </select>
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to Kandang (Optional)</label>
                      <select 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                          value={formData.kandang_id}
                          onChange={(e) => setFormData({...formData, kandang_id: e.target.value})}
                      >
                          <option value="">Full Access</option>
                          {kandangList.map(k => (
                              <option key={k.id} value={k.id}>{k.nama}</option>
                          ))}
                      </select>
                  </div>
                </>
              )}
              
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
