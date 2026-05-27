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
      <section id="servicios" className="py-32 bg-zinc-950 relative overflow-hidden">
        {/* Luces de fondo ambientales */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-zinc-800/50 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Catálogo</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">Nuestros Servicios</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Utilizamos productos certificados de clase mundial como Symplex, 3M, Simoniz, Pintuco y Glasurit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-24">
            {SERVICES.map((category, idx) => (
              <div key={idx} className="relative">
                {/* Título de Categoría Moderno */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20 text-lg">
                        0{idx + 1}
                      </span>
                      {category.category}
                    </h3>
                  </div>
                  <span className="text-gray-400 text-sm md:text-right max-w-md font-medium">
                    {category.description}
                  </span>
                </div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                >
                  {category.items.map((service, sIdx) => {
                    const Icon = service.icon;
                    
                    return (
                      <motion.div 
                        key={sIdx} 
                        variants={fadeIn}
                        className="relative bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-yellow-500/30 hover:bg-zinc-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.15)] group flex flex-col overflow-hidden"
                      >
                        {/* Brillo sutil de la tarjeta en hover */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-[60px] group-hover:bg-yellow-500/10 transition-all duration-500"></div>

                        {/* @ts-ignore */}
                        {service.isNew && (
                          <div className="absolute top-6 right-6 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase">NUEVO</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col mb-6 relative z-10">
                          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner border border-white/5 mb-6 group-hover:border-yellow-500/30 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            <Icon className="text-gray-400 group-hover:text-yellow-500 transition-colors duration-500" size={32} strokeWidth={1.5} />
                          </div>
                          
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                            {service.desc}
                          </p>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Inversión desde</span>
                            <span className="text-2xl font-black text-white font-mono tracking-tight group-hover:text-yellow-500 transition-colors">
                              {service.price}
                            </span>
                          </div>

                          <a 
                              href={`${COMPANY_INFO.whatsappUrl}?text=Hola, me interesa cotizar el servicio de ${service.title}`} 
                              target="_blank" 
                              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all duration-300 group/link border border-white/5 hover:border-yellow-500"
                              title="Cotizar Servicio"
                          >
                              <ArrowRight size={20} className="group-hover/link:translate-x-1 transition-transform" />
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
      <section className="py-32 bg-zinc-950 relative overflow-hidden border-t border-white/5">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] opacity-50"></div>
        
        {/* Patrón de puntos o cuadrícula sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
             <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Trayectoria</span>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">Nuestra Historia</h2>
             <div className="h-1 w-24 bg-yellow-500 mx-auto rounded-full mb-6"></div>
             <p className="text-gray-400 text-lg max-w-2xl mx-auto">El camino de la excelencia, pasión y evolución constante desde el 2005.</p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Línea central vertical con gradiente */}
            <div className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent rounded-full" />
            
            <div className="space-y-16">
              {TIMELINE.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Espaciador para un lado */}
                  <div className="flex-1 w-full" />
                  
                  {/* Punto en la línea con animación */}
                  <div className="absolute left-[12px] md:left-1/2 md:-ml-[10px] flex items-center justify-center mt-2 md:mt-0 z-20">
                    <div className="w-5 h-5 rounded-full bg-zinc-950 border-4 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-ping opacity-50"></div>
                    </div>
                  </div>
                  
                  {/* Tarjeta de contenido */}
                  <div className={`flex-1 w-full pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                    <div className="group bg-zinc-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-yellow-500/50 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.2)] relative overflow-hidden">
                      {/* Marca de agua del año */}
                      <span className={`text-8xl font-black text-white/[0.03] absolute -bottom-4 select-none transition-transform duration-500 group-hover:scale-110 ${idx % 2 === 0 ? '-left-4' : '-right-4'}`}>
                        {item.year}
                      </span>
                      
                      <div className={`inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-lg mb-4 font-mono shadow-[0_0_10px_rgba(234,179,8,0.1)]`}>
                        {item.year}
                      </div>
                      
                      <h3 className="text-white font-bold text-2xl mb-3 group-hover:text-yellow-500 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 text-base leading-relaxed relative z-10">{item.description}</p>
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