import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Car,
  User,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Definimos qué enlaces ve el usuario según su rol
  const navItems = role === 'admin' 
    ? [
        { name: 'Vista General', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Calendario', path: '/dashboard/calendario', icon: CalendarDays },
        { name: 'Trabajos', path: '/dashboard/trabajos', icon: Briefcase },
        { name: 'Clientes', path: '/dashboard/clientes', icon: Users },
        { name: 'Reseñas', path: '/dashboard/resenas', icon: MessageSquare },
        { name: 'Configuración', path: '/dashboard/configuracion', icon: Settings },
      ]
    : [
        { name: 'Mis Vehículos', path: '/dashboard', icon: Car },
        { name: 'Agendamiento', path: '/dashboard/calendario', icon: CalendarDays },
        { name: 'Mis Reseñas', path: '/dashboard/resenas', icon: MessageSquare },
        { name: 'Mi Perfil', path: '/dashboard/perfil', icon: User },
      ];

  const SidebarContent = () => (
    <>
      <div className="p-6 bg-zinc-950/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white p-0.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
            <img src="/PNG A COLOR.png" alt="MotoPolish" className="h-8 w-auto object-contain scale-110" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            MOTO<span className="text-yellow-500">POLISH</span>
          </span>
        </Link>
      </div>

      <div className="px-6 py-4 border-b border-white/5">
        <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Usuario'}</p>
        <p className="text-xs text-yellow-500 font-medium mt-1 uppercase tracking-wider">
          {role === 'admin' ? 'Administrador' : 'Cliente'}
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          // Determina si estamos en la ruta actual para resaltarla
          // Para evitar que '/' resalte todo, hacemos una comparación exacta o `startsWith` cuidadoso
          const isActive = location.pathname === item.path || 
                         (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                         
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar Escritorio */}
      <aside className="hidden md:flex flex-col w-72 bg-zinc-900 border-r border-white/5 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Header Móvil */}
      <div className="md:hidden fixed top-0 w-full bg-zinc-900 border-b border-white/5 z-50 flex items-center justify-between p-4 shadow-lg shadow-black/20">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white p-0.5 rounded-lg">
            <img src="/PNG A COLOR.png" alt="MotoPolish" className="h-7 w-auto object-contain scale-110" />
          </div>
          <span className="text-lg font-bold text-white tracking-tighter">
            MOTO<span className="text-yellow-500">POLISH</span>
          </span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Menú Móvil Modal */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-[80%] bg-zinc-900 h-full">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenido Principal (Outlet renderiza las subrutas) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:pt-0 pt-16">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
