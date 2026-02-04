import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO, SERVICES, TIMELINE, VALUES } from '../constants/data';
import Footer from '../components/Footer';

// Variantes de animación para reutilizar
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* --- HERO SECTION (Portada) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Fondo con gradiente e imagen de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-zinc-950 z-10" />
        <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-[2s] transform scale-105" 
        />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-sm font-semibold tracking-wider mb-6 backdrop-blur-sm">
              EXPERTOS EN DETAILING
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
              RESTAURA EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">BRILLO</span> <br/>
              DE TU PASIÓN
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {COMPANY_INFO.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={COMPANY_INFO.whatsappUrl} 
                target="_blank"
                className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Cotizar Ahora
              </a>
              <a 
                href="#servicios"
                className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/20 hover:bg-white/10 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2"
              >
                Ver Precios
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICIOS CON PRECIOS --- */}
      <section id="servicios" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nuestros Servicios</h2>
            <div className="h-1 w-24 bg-yellow-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Utilizamos productos certificados de marcas como Symplex, 3M, Simoniz, Pintuco y Glasurit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {SERVICES.map((category, idx) => (
              <div key={idx} className="relative">
                {/* Título de Categoría Decorativo */}
                <div className="mb-10 flex items-end gap-4 border-b border-gray-800 pb-4">
                  <h3 className="text-3xl font-bold text-white">
                    {category.category}
                  </h3>
                  <span className="text-gray-500 text-sm pb-1 hidden sm:block">
                    — {category.description}
                  </span>
                </div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                >
                  {category.items.map((service, sIdx) => {
                    // CORRECCIÓN: Asignamos el icono a una variable con mayúscula
                    const Icon = service.icon;
                    
                    return (
                      <motion.div 
                        key={sIdx} 
                        variants={fadeIn}
                        className="relative bg-zinc-900/40 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/50 hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5 group flex flex-col"
                      >
                        {/* Badge de Nuevo (Hidroimpresión) */}
                        {/* @ts-ignore */}
                        {service.isNew && (
                          <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-10 border-2 border-zinc-950">
                            NUEVO
                          </span>
                        )}

                        <div className="flex justify-between items-start mb-5">
                          <div className="bg-zinc-800/80 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-300">
                            {/* Usamos el componente Icon corregido */}
                            <Icon className="text-gray-300 group-hover:text-black transition-colors" size={28} />
                          </div>
                          <div className="text-right">
                              <span className="block text-xs text-gray-500 uppercase tracking-wide">Desde</span>
                              <span className="text-xl font-bold text-yellow-500 font-mono tracking-tight">
                              {service.price}
                              </span>
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                          {service.desc}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-white/5">
                          <a 
                              href={`${COMPANY_INFO.whatsappUrl}?text=Hola, me interesa cotizar el servicio de ${service.title}`} 
                              target="_blank" 
                              className="w-full flex items-center justify-between text-sm font-bold text-gray-300 hover:text-white transition-colors group/link"
                          >
                              <span>Cotizar Servicio</span>
                              <span className="bg-white/10 p-1 rounded-full group-hover/link:bg-yellow-500 group-hover/link:text-black transition-colors">
                                  <ArrowRight size={14} />
                              </span>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NOSOTROS & MISIÓN --- */}
      <section id="nosotros" className="py-24 bg-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Texto */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
              <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Sobre MotoPolish</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-8">
                Más que un taller, <br/>un centro de transformación.
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Somos MotoPolish Santander. Desde Lebrija para todo el departamento, garantizamos soluciones personalizadas. 
                No somos simples lavadores; somos técnicos especializados aliados con las mejores marcas del mundo.
              </p>
              
              <div className="space-y-6">
                <div className="bg-black/20 p-6 rounded-xl border-l-4 border-yellow-500 backdrop-blur-sm">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Nuestra Misión
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Brindar un servicio completo enfocado al embellecimiento y restauración, 
                    con énfasis en el cuidado a largo plazo, garantizando productos de máxima calidad y precios accesibles.
                  </p>
                </div>
                <div className="bg-black/20 p-6 rounded-xl border-l-4 border-zinc-600 backdrop-blur-sm">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-zinc-500"></span> Nuestra Visión 2030
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Llegar a ser la empresa líder en Santander, maximizando la credibilidad y generando más de 10 empleos 
                    para el desarrollo económico de Lebrija.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Valores (Grid) */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
              {VALUES.map((val, idx) => (
                <div key={idx} className="bg-zinc-800/50 p-6 rounded-xl hover:bg-zinc-800 transition-colors border border-white/5 hover:border-yellow-500/30">
                  <val.icon className="text-yellow-500 mb-4" size={32} />
                  <h4 className="text-white font-bold mb-2">{val.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- LÍNEA DE TIEMPO --- */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white mb-2">Nuestra Historia</h2>
             <p className="text-gray-500">El camino de la excelencia desde 2005</p>
          </div>
          
          <div className="relative">
            {/* Línea central vertical */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent" />
            
            <div className="space-y-12">
              {TIMELINE.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full" />
                  
                  {/* Punto en la línea */}
                  <div className="absolute left-[13px] md:left-1/2 md:-ml-[6px] w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] z-10 mt-1.5 md:mt-0" />
                  
                  <div className="flex-1 w-full pl-12 md:pl-0 md:px-12">
                    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/40 transition-all hover:-translate-y-1 relative overflow-hidden">
                      <span className="text-6xl font-black text-white/5 absolute -top-4 -right-2 select-none">{item.year}</span>
                      <span className="text-yellow-500 font-bold text-xl block mb-1 font-mono">{item.year}</span>
                      <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 bg-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-black mb-6 uppercase tracking-tight">
            ¿Listo para ver tu vehículo <br/> como nuevo?
          </h2>
          <p className="text-black/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Agenda tu cita hoy mismo con nuestros técnicos especializados y recibe una valoración personalizada.
          </p>
          <a 
            href={COMPANY_INFO.whatsappUrl} 
            target="_blank"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-zinc-800 transition-all shadow-2xl hover:shadow-black/50 transform hover:-translate-y-1"
          >
            <MessageCircle className="text-yellow-500" />
            Agendar Cita por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}