import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { useTheme } from '../hooks/useTheme';
import { 
  Warehouse, 
  Bird, 
  Egg, 
  Skull, 
  Wheat, 
  TrendingUp, 
  Loader2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const SummaryCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg shadow-opacity-20`}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
        </h3>
        {trend && <span className="text-xs font-bold text-green-500 flex items-center">{trend}</span>}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState({ production: [], productionByKandang: [] });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, chartsRes] = await Promise.all([
          axios.get('/dashboard/summary'),
          axios.get('/dashboard/charts')
        ]);
        setSummary(summaryRes.data.data);
        setCharts(chartsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  const chartColors = [
    theme.primary[500],
    theme.success[500],
    theme.warning[500],
    theme.danger[500],
    '#3b82f6'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500">Real-time statistics for your farm operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Kandang" 
          value={summary?.total_kandang} 
          icon={Warehouse} 
          color="bg-primary-500"
        />
        <SummaryCard 
          title="Ayam Aktif" 
          value={summary?.total_ayam_aktif} 
          icon={Bird} 
          color="bg-primary-500"
        />
        <SummaryCard 
          title="Produksi Hari Ini" 
          value={summary?.produksi_hari_ini} 
          icon={Egg} 
          color="bg-success-500"
        />
        <SummaryCard 
          title="Kematian Hari Ini" 
          value={summary?.kematian_hari_ini} 
          icon={Skull} 
          color="bg-danger-500"
        />
        <SummaryCard 
          title="Pakan Terpakai (KG)" 
          value={summary?.total_pakan_hari_ini} 
          icon={Wheat} 
          color="bg-warning-500"
        />
        <SummaryCard 
          title="Pendapatan Bulan Ini" 
          value={`Rp ${summary?.total_pendapatan_bulan_ini?.toLocaleString('id-ID')}`} 
          icon={TrendingUp} 
          color="bg-success-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Production Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg">Produksi Telur (7 Hari Terakhir)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.production}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={theme.primary[500]} 
                    strokeWidth={3} 
                    dot={{r: 4, fill: theme.primary[500], strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production by Kandang Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg">Produksi per Kandang (30 Hari Terakhir)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.productionByKandang}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                   {charts.productionByKandang.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
