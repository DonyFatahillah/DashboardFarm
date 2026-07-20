import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Kandang from './pages/Kandang';
import Produksi from './pages/Produksi';
import Kematian from './pages/Kematian';
import Pakan from './pages/Pakan';
import Penjualan from './pages/Penjualan';
import Absen from './pages/Absen';
import Kesehatan from './pages/Kesehatan';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const { lang } = useParams();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={`/${lang}/login`} />;
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${lang}/dashboard`} />;
  }
  
  return children;
};

const LanguageHandler = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const supportedLangs = ['en', 'id'];
    if (lang && supportedLangs.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else {
      // If no valid language in URL, detect and redirect
      const detectedLang = i18n.language.split('-')[0];
      const targetLang = supportedLangs.includes(detectedLang) ? detectedLang : 'en';
      const newPath = `/${targetLang}${location.pathname === '/' ? '' : location.pathname}`;
      navigate(newPath, { replace: true });
    }
  }, [lang, i18n, navigate, location.pathname]);

  return null;
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith('/admin')) {
      document.title = 'Dashboard Farm Management';
    } else {
      document.title = 'Bu Sri Farm';
    }
  }, [location]);

  return null;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <TitleUpdater />
      <Routes>
        <Route path="/:lang/*" element={
          <>
            <LanguageHandler />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to="../dashboard" /> : <Landing />} />
              <Route path="/login" element={user ? <Navigate to="../dashboard" /> : <Login />} />
              
              {/* Protected Dashboard Routes */}
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/kandang" element={<Kandang />} />
                <Route path="/produksi" element={<Produksi />} />
                <Route path="/kematian" element={<Kematian />} />
                <Route path="/pakan" element={<Pakan />} />
                <Route path="/penjualan" element={<Penjualan />} />
                <Route path="/absen" element={<Absen />} />
                <Route path="/kesehatan" element={<Kesehatan />} />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="OWNER">
                    <Admin />
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        } />
        {/* Redirect root to detected language */}
        <Route path="*" element={<LanguageHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
