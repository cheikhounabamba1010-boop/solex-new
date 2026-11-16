import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sun,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not loading and not authenticated, redirect to login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span>Vérification de la session SOLEX...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/admin/constructeur', label: 'Constructeur Visuel (Glisser-Déposer)', icon: Layers },
    { to: '/admin/produits', label: 'Gestion des produits', icon: Package },
    { to: '/admin/mediatheque', label: 'Médiathèque (Photos)', icon: FolderOpen },
    { to: '/admin/demandes', label: 'Demandes de devis', icon: Inbox },
    { to: '/admin/reglages', label: 'Contenus & Réglages', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      {/* 1. Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
            SX
          </div>
          <div>
            <div className="text-xs font-bold leading-none">SOLEX ADMIN</div>
            <div className="text-[10px] text-slate-400">Espace privé</div>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#123D32] to-[#247A54] flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
                SX
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white tracking-wide">
                  SOLEX ADMIN
                </h1>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Tableau de bord privé
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer User & External Link */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Voir le site public</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-emerald-400 font-bold shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <span className="truncate text-slate-300 font-medium">
                  {user?.username || 'Admin'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        {/* Desktop Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Session active · Connecté en tant que{' '}
            <strong className="text-slate-800">{user?.username}</strong>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#123D32] font-semibold"
            >
              <span>Accéder au site public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
