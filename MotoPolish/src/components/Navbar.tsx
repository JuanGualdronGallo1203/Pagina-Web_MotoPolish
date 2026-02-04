import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Car className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              MOTO<span className="text-yellow-500">POLISH</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Inicio</Link>
              <a href="#servicios" className="hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
              <a href="#nosotros" className="hover:text-yellow-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Nosotros</a>
              
              {/* Botón de Acceso */}
              <Link to="/login" className="bg-yellow-500 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2">
                <User size={18} />
                Ingresar
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-500">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-yellow-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-white hover:text-yellow-500">Inicio</Link>
            <a href="#servicios" className="block px-3 py-2 text-white hover:text-yellow-500">Servicios</a>
            <Link to="/login" className="block w-full text-left px-3 py-2 text-yellow-500 font-bold">Ingresar</Link>
          </div>
        </div>
      )}
    </nav>
  );
}