import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Users, TrendingUp, ShoppingBag, Activity, Globe, MessageCircle, Mail, Instagram, X as CloseIcon, Menu, X } from 'lucide-react';
import AIChatbox from '../components/AIChatbox';

const ContactModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const contacts = [
    {
      icon: MessageCircle,
      label: t('contact_modal.whatsapp'),
      value: '+62 812-xxxx-xxxx',
      color: 'bg-green-500',
      link: 'https://wa.me/6281200000000'
    },
    {
      icon: Mail,
      label: t('contact_modal.email'),
      value: 'contact@busrifarm.com',
      color: 'bg-blue-500',
      link: 'mailto:contact@busrifarm.com'
    },
    {
      icon: Instagram,
      label: t('contact_modal.instagram'),
      value: '@busrifarm_official',
      color: 'bg-pink-500',
      link: 'https://instagram.com/busrifarm_official'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('contact_modal.title')}</h3>
            <p className="text-sm text-gray-500">{t('contact_modal.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {contacts.map((contact, idx) => (
            <a 
              key={idx}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 rounded-2xl border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition-all group"
            >
              <div className={`${contact.color} p-3 rounded-xl text-white shadow-lg shadow-opacity-20`}>
                <contact.icon className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{contact.label}</p>
                <p className="text-sm font-semibold text-gray-900">{contact.value}</p>
              </div>
              <div className="text-gray-300 group-hover:text-green-500 transition-colors">
                <Globe className="h-5 w-5" />
              </div>
            </a>
          ))}
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {t('contact_modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const response = await axios.get('public/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching public stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicStats();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    navigate(`/${newLang}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`);
  };

  const handleOrderEggs = () => {
    const message = encodeURIComponent(t('whatsapp_messages.order_eggs'));
    const whatsappUrl = `https://wa.me/6281200000000?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        t={t}
      />
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Bu Sri Farm</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#hero" className="text-gray-600 hover:text-green-600 font-medium">{t('nav.home')}</a>
              <a href="#statistics" className="text-gray-600 hover:text-green-600 font-medium">{t('nav.statistics')}</a>
              <a href="#features" className="text-gray-600 hover:text-green-600 font-medium">{t('nav.features')}</a>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 font-medium bg-gray-100 px-3 py-1 rounded-full transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{i18n.language === 'en' ? 'ID' : 'EN'}</span>
              </button>
              <button 
                onClick={handleOrderEggs}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-md"
              >
                {t('nav.buy_now')}
              </button>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
              >
                {t('nav.contact_us')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
            <a 
              href="#hero" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-gray-700 hover:text-green-600 py-2"
            >
              {t('nav.home')}
            </a>
            <a 
              href="#statistics" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-gray-700 hover:text-green-600 py-2"
            >
              {t('nav.statistics')}
            </a>
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-gray-700 hover:text-green-600 py-2"
            >
              {t('nav.features')}
            </a>
            <div className="pt-4 space-y-3">
              <button 
                onClick={() => { handleOrderEggs(); setIsMobileMenuOpen(false); }}
                className="w-full bg-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-md"
              >
                {t('nav.buy_now')}
              </button>
              <button 
                onClick={() => { setIsContactModalOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-sm"
              >
                {t('nav.contact_us')}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{t('hero.title')}</span>{' '}
                  <span className="block text-green-600 xl:inline">{t('hero.subtitle')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('hero.description')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#statistics" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                      {t('hero.view_stats')}
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                      {t('hero.our_features')}
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/assets/image.png"
            alt="Farm monitoring"
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('stats.title')}</h2>
            <p className="mt-4 text-xl text-gray-500">{t('stats.subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('stats.total_damaged_eggs')}</dt>
                        <dd className="text-lg font-bold text-gray-900">{stats?.totalTelurRusak?.toLocaleString() || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{t('stats.today_production')}</dt>
                          <dd className="text-lg font-bold text-gray-900">{stats?.produksiHariIni?.toLocaleString() || 0} Eggs</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Pupuk Terjual (Karung)</dt>
                          <dd className="text-lg font-bold text-gray-900">{stats?.totalPupukTerjual?.toLocaleString() || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('stats.production_trend')}</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('stats.production_volume')}</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Feature section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">{t('features.tag')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('features.title')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mb-6">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.analytics_title')}</h3>
              <p className="text-gray-600 text-center">{t('features.analytics_desc')}</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.inventory_title')}</h3>
              <p className="text-gray-600 text-center">{t('features.inventory_desc')}</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500 text-white mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.staff_title')}</h3>
              <p className="text-gray-600 text-center">{t('features.staff_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-4">Bu Sri Farm</h3>
              <p className="text-gray-400">{t('footer.motto')}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.quick_links')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#hero" className="hover:text-green-500">{t('nav.home')}</a></li>
                <li><a href="#statistics" className="hover:text-green-500">{t('nav.statistics')}</a></li>
                <li><a href="#features" className="hover:text-green-500">{t('nav.features')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.contact_us')}</h4>
              <p className="text-gray-400 italic">"{t('footer.motto')}"</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; 2026 Bu Sri Farm. {t('footer.rights')}
          </div>
        </div>
      </footer>
      <AIChatbox />
    </div>
  );
};

export default Landing;
