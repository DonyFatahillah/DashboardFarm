import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { 
  Warehouse, 
  Bird, 
  Egg, 
  Skull, 
  Wheat, 
  TrendingUp, 
  Loader2,
  Calendar,
  CheckCircle
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

const SummaryCard = ({ title, value, icon: Icon, color, trend, locale }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg`}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
          {typeof value === 'number' ? value.toLocaleString(locale) : value}
        </h3>
        {trend && <span className="text-xs font-bold text-emerald-500 flex items-center">{trend}</span>}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState({ production: [], productionByKandang: [] });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang === 'id' ? 'id-ID' : 'en-US';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, chartsRes] = await Promise.all([
          axios.get('dashboard/summary'),
          axios.get('dashboard/charts')
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
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  const chartColors = ['#475569', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('dashboard.title')}</h2>
          <p className="text-slate-500">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">{new Date().toLocaleDateString(locale, { dateStyle: 'long' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          title={t('dashboard.total_kandang')} 
          value={summary?.total_kandang} 
          icon={Warehouse} 
          color="bg-slate-700"
          locale={locale}
        />
        <SummaryCard 
          title={t('dashboard.active_livestock')} 
          value={summary?.total_ayam_aktif} 
          icon={Bird} 
          color="bg-slate-700"
          locale={locale}
        />
        <SummaryCard 
          title="Total Telur Terjual" 
          value={summary?.total_telur_terjual_hari_ini} 
          icon={Egg} 
          color="bg-emerald-600"
          locale={locale}
        />
        <SummaryCard 
          title={t('dashboard.today_mortality')} 
          value={summary?.kematian_hari_ini} 
          icon={Skull} 
          color="bg-rose-500"
          locale={locale}
        />
        <SummaryCard 
          title={t('dashboard.today_sorting')} 
          value={summary?.sortir_hari_ini} 
          icon={CheckCircle} 
          color="bg-orange-500"
          locale={locale}
        />
        <SummaryCard 
          title={t('dashboard.feed_used')} 
          value={summary?.total_pakan_hari_ini} 
          icon={Wheat} 
          color="bg-amber-500"
          locale={locale}
        />
        <SummaryCard 
          title={t('dashboard.monthly_revenue')} 
          value={formatCurrency(summary?.total_pendapatan_bulan_ini || 0)} 
          icon={TrendingUp} 
          color="bg-emerald-700"
          locale={locale}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg">{t('dashboard.production_7d')}</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.production}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#475569" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#475569', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg">{t('dashboard.production_per_pen')}</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.productionByKandang}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
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
