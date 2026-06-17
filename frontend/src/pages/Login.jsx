import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Wheat, Lock, User, Eye, EyeOff, Loader2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    
    if (result.success) {
      toast.success(t('login.welcome_back'));
      navigate(`/${lang}/dashboard`);
    } else {
      toast.error(result.message);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    navigate(`/${newLang}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-xl transition-all hover:shadow-md"
        >
          <Globe className="h-4 w-4" />
          <span>{i18n.language === 'en' ? 'Indonesia' : 'English'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-primary-500 p-3 rounded-2xl text-white shadow-xl shadow-primary-100">
                <Wheat className="w-10 h-10" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-900 tracking-tight">
          {t('login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-gray-200/50 sm:rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('login.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t('login.username_placeholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('login.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('login.sign_in')
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <p className="text-center text-xs text-gray-400">
                &copy; 2026 Farm Management Solutions. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
