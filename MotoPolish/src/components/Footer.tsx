import { Facebook, Instagram, Youtube, Phone, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../constants/data';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 border-t border-yellow-500/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Columna 1: Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MOTO<span className="text-yellow-500">POLISH</span></h3>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Centro especializado en embellecimiento y restauración automotriz. 
              Aliados de las mejores marcas para garantizar resultados de exhibición.
            </p>
            <div className="flex gap-4">
              <a href={COMPANY_INFO.social.facebook} target="_blank" className="hover:text-yellow-500 transition-colors"><Facebook size={20} /></a>
              <a href={COMPANY_INFO.social.instagram} target="_blank" className="hover:text-yellow-500 transition-colors"><Instagram size={20} /></a>
              <a href={COMPANY_INFO.social.youtube} target="_blank" className="hover:text-yellow-500 transition-colors"><Youtube size={20} /></a>
              <a href={COMPANY_INFO.social.tiktok} target="_blank" className="hover:text-yellow-500 transition-colors">
                {/* Icono de TikTok simple */}
                <svg viewBox="0 0 24 24" fill="currentColor" height="20" width="20"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-yellow-500 w-max pb-2">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-yellow-500 transition-colors">Nuestros Servicios</a></li>
              <li><a href="#nosotros" className="hover:text-yellow-500 transition-colors">Quiénes Somos</a></li>
              <li><a href="/login" className="hover:text-yellow-500 transition-colors">Área de Clientes</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-yellow-500 w-max pb-2">Contáctanos</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-yellow-500 mt-1" size={18} />
                <p>Calle 12 #16-40, Barrio Los Sauces,<br/>Lebrija, Santander</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-yellow-500" size={18} />
                <p>{COMPANY_INFO.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} MotoPolish Santander. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}