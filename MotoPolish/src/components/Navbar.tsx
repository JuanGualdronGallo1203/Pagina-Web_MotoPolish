import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Car, User, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
              <img src="/PNG A COLOR.png" alt="MotoPolish" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white hidden sm:block">
              MOTO<span className="text-yellow-500">POLISH</span>
            </span>
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="/" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Inicio
              </Link>
              <a href="/#servicios" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
              <a href="/#productos" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Tienda</a>
              <a href="/#nosotros" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Nosotros</a>
              
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                {!user ? (
                  <>
                    {/* Botón Ingresar */}
                    <Link to="/login" className="text-white hover:text-yellow-500 font-medium text-sm flex items-center gap-2">
                      <LogIn size={16} />
                      Ingresar
                    </Link>
                    
                    {/* Botón Registrarse */}
                    <Link to="/registro" className="bg-yellow-500 text-black px-5 py-2.5 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg shadow-yellow-500/10">
                      <User size={16} />
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Mi Panel */}
                    <Link to="/dashboard" className="text-white hover:text-yellow-500 font-medium text-sm flex items-center gap-2">
                      <LayoutDashboard size={16} />
                      Mi Panel
                    </Link>
                    
                    {/* Botón Cerrar Sesión */}
                    <button 
                      onClick={handleLogout} 
                      className="bg-zinc-800 text-white p-2.5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all shadow-lg border border-white/5 ml-2"
                      title="Cerrar Sesión"
                    >
                      <LogOut size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-500 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-yellow-500/20">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-3 text-white hover:text-yellow-500 border-b border-white/5" 
              onClick={() => {
                setIsOpen(false);
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              Inicio
            </Link>
            <a href="/#servicios" className="block px-3 py-3 text-white hover:text-yellow-500 border-b border-white/5" onClick={() => setIsOpen(false)}>Servicios</a>
            <a href="/#productos" className="block px-3 py-3 text-white hover:text-yellow-500 border-b border-white/5" onClick={() => setIsOpen(false)}>Tienda</a>
            
            <div className="pt-4 grid grid-cols-2 gap-3">
              {!user ? (
                <>
                  <Link to="/login" className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5" onClick={() => setIsOpen(false)}>
                    <LogIn size={16} /> Ingresar
                  </Link>
                  <Link to="/registro" className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400" onClick={() => setIsOpen(false)}>
                    <User size={16} /> Crear Cuenta
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard size={16} /> Mi Panel
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20">
                    <LogOut size={16} /> Salir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}