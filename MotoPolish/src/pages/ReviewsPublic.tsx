import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Star, MessageSquare, Loader2, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  adminReply?: string;
}

export default function ReviewsPublic() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Scroll a inicio al cargar
    window.scrollTo(0, 0);
    
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          size={16} 
          fill={star <= rating ? "#EAB308" : "transparent"} 
          className={star <= rating ? "text-yellow-500" : "text-zinc-600"}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pt-20">
      <main className="flex-grow container mx-auto px-4 py-16">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 text-yellow-500 mb-6">
              <MessageSquare size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Lo que dicen nuestros <span className="text-yellow-500">Clientes</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              La satisfacción de quienes confían en nosotros es nuestra mejor carta de presentación. 
              Descubre las experiencias reales de clientes que han transformado sus vehículos en MotoPolish.
            </p>
            
            {user ? (
              <Link 
                to="/dashboard/resenas"
                className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
              >
                Escribir una Reseña
              </Link>
            ) : (
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                Inicia sesión para opinar
              </Link>
            )}
          </motion.div>
        </div>

        {/* Grid de Reseñas */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mb-4" />
            <p className="font-medium text-lg">Cargando experiencias...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-zinc-900/50 rounded-3xl border border-white/5">
            <MessageSquare size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-white mb-2">Sé el primero en opinar</p>
            <p>Aún no tenemos reseñas publicadas en la plataforma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <motion.div 
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative group hover:border-yellow-500/30 transition-all duration-300 flex flex-col"
              >
                <Quote className="absolute top-6 right-6 text-white/5 group-hover:text-yellow-500/10 transition-colors" size={48} />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-xl shadow-lg">
                    {(rev.userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{rev.userName || 'Usuario Anónimo'}</h3>
                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} />
                      <span className="text-xs text-gray-500 font-mono">
                        {rev.createdAt ? new Date(rev.createdAt.toDate()).toLocaleDateString('es-CO') : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed italic flex-grow relative z-10">
                  "{rev.comment}"
                </p>

                {rev.adminReply && (
                  <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-white border border-yellow-500 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)] overflow-hidden">
                        <img src="/PNG A COLOR.png" className="w-[120%] h-[120%] object-contain scale-125" alt="MP" />
                      </div>
                      <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">MotoPolish</span>
                    </div>
                    <p className="text-sm text-gray-400 pl-8">{rev.adminReply}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
