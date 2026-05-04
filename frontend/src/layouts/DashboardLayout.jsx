import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Warehouse, 
  Egg, 
  Skull, 
  Wheat, 
  ShoppingCart, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...args) => twMerge(clsx(args));

const SidebarLink = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-primary-500 text-white shadow-lg" 
          : "text-gray-600 hover:bg-primary-50 hover:text-primary-500"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-primary-500")} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/kandang', icon: Warehouse, label: 'Kandang' },
    { to: '/produksi', icon: Egg, label: 'Produksi' },
    { to: '/kematian', icon: Skull, label: 'Kematian' },
    { to: '/pakan', icon: Wheat, label: 'Pakan' },
    { to: '/penjualan', icon: ShoppingCart, label: 'Penjualan' },
    ...(user?.role === 'OWNER' ? [{ to: '/admin', icon: Settings, label: 'Admin' }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col sticky top-0 h-screen",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-primary-500 p-1.5 rounded-lg text-white">
                <Wheat className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-primary-900 tracking-tight">FarmDash</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 py-4">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.to} 
              {...item} 
              collapsed={sidebarCollapsed} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200",
              sidebarCollapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(i => i.to === window.location.pathname)?.label || 'Overview'}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left mr-2">
                  <p className="text-sm font-semibold text-gray-700 leading-none">{user?.username}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                   <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 uppercase font-bold">Account Settings</p>
                   </div>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                    <User className="w-4 h-4" /> Profile Details
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
