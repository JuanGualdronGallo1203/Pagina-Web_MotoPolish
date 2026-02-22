import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, User, LogIn } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-yellow-500 p-2 rounded-lg group-hover:bg-yellow-400 transition-colors">
              <Car className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              MOTO<span className="text-yellow-500">POLISH</span>
            </span>
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Inicio</Link>
              <a href="/#servicios" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
              <a href="/#nosotros" className="text-white hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Nosotros</a>
              
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
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
            <Link to="/" className="block px-3 py-3 text-white hover:text-yellow-500 border-b border-white/5" onClick={() => setIsOpen(false)}>Inicio</Link>
            <a href="/#servicios" className="block px-3 py-3 text-white hover:text-yellow-500 border-b border-white/5" onClick={() => setIsOpen(false)}>Servicios</a>
            
            <div className="pt-4 grid grid-cols-2 gap-3">
              <Link to="/login" className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5" onClick={() => setIsOpen(false)}>
                <LogIn size={16} /> Ingresar
              </Link>
              <Link to="/registro" className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400" onClick={() => setIsOpen(false)}>
                <User size={16} /> Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}