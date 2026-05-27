import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { Star, MessageSquare, Trash2, Edit2, Loader2, Send, X, AlertCircle } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  adminReply?: string;
}

export default function DashboardReviews() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states (Client)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (Admin Reply)
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Delete modal state
  const [deleteData, setDeleteData] = useState<{ id: string, type: 'review' | 'reply' } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [user, isAdmin]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let q;
      if (isAdmin) {
        q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'reviews'), where('userId', '==', user?.uid));
      }
      const snap = await getDocs(q);
      let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      
      // If client, we need to sort manually since we queried by where
      if (!isAdmin) {
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      }
      
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(5);
    setComment('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return alert("El comentario no puede estar vacío");
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'reviews', editingId), {
          rating,
          comment,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'reviews'), {
          userId: user?.uid,
          userName: user?.displayName || 'Usuario',
          rating,
          comment,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error("Error saving review", error);
      alert("Hubo un error al guardar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === 'review') {
        await deleteDoc(doc(db, 'reviews', deleteData.id));
        setReviews(reviews.filter(r => r.id !== deleteData.id));
      } else {
        await updateDoc(doc(db, 'reviews', deleteData.id), {
          adminReply: ''
        });
        setReviews(reviews.map(r => r.id === deleteData.id ? { ...r, adminReply: '' } : r));
      }
      setDeleteData(null);
    } catch (error) {
      console.error("Error deleting", error);
      alert("Error al eliminar");
    }
  };

  const handleReplySubmit = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await updateDoc(doc(db, 'reviews', id), {
        adminReply: replyText
      });
      setReviews(reviews.map(r => r.id === id ? { ...r, adminReply: replyText } : r));
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error("Error replying to review", error);
      alert("Error al guardar la respuesta");
    }
  };

  const handleEditReply = (rev: Review) => {
    setReplyingTo(rev.id);
    setReplyText(rev.adminReply || '');
  };

  const openEdit = (rev: Review) => {
    setRating(rev.rating);
    setComment(rev.comment);
    setEditingId(rev.id);
    setIsModalOpen(true);
  };

  // Star Rating Component
  const StarRating = ({ currentRating, onChange }: { currentRating: number, onChange?: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(star)}
          className={`${onChange ? 'hover:scale-110 transition-transform' : ''} ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star 
            size={onChange ? 32 : 20} 
            fill={star <= currentRating ? "#EAB308" : "transparent"} 
            className={star <= currentRating ? "text-yellow-500" : "text-zinc-600"}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-yellow-500" />
            {isAdmin ? 'Gestión de Reseñas' : 'Mis Reseñas'}
          </h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'Administra las calificaciones y responde a los comentarios de tus clientes.' 
              : 'Comparte tu experiencia con MotoPolish. Tu opinión nos ayuda a mejorar.'}
          </p>
        </div>

        {!isAdmin && (
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <MessageSquare size={20} />
            Dejar una Reseña
          </button>
        )}
      </div>

      {/* Lista de Reseñas */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
            <p className="font-medium">Cargando reseñas...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            <MessageSquare size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium text-white mb-1 text-xl">
              {isAdmin ? 'Aún no hay reseñas' : 'Aún no has escrito ninguna reseña'}
            </p>
            {!isAdmin && <p className="text-sm">¡Anímate a ser el primero en calificar nuestro servicio!</p>}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviews.map(rev => (
              <div key={rev.id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info Principal */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {isAdmin && <p className="text-sm text-gray-400 mb-1">Cliente: <span className="text-white font-medium">{rev.userName}</span></p>}
                        <StarRating currentRating={rev.rating} />
                        <span className="text-xs text-gray-500 mt-2 block font-mono">
                          {rev.createdAt ? new Date(rev.createdAt.toDate()).toLocaleDateString('es-CO') : 'Reciente'}
                        </span>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        {!isAdmin && (
                          <button 
                            onClick={() => openEdit(rev)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20"
                            title="Editar Reseña"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setDeleteData({ id: rev.id, type: 'review' })}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                          title="Eliminar Reseña"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                      "{rev.comment}"
                    </p>

                    {/* Respuesta del Admin */}
                    {rev.adminReply && replyingTo !== rev.id ? (
                      <div className="ml-4 md:ml-8 mt-4 bg-yellow-500/10 border-l-2 border-yellow-500 p-4 rounded-r-xl relative group/reply">
                        <p className="text-xs text-yellow-500 font-bold mb-1 uppercase tracking-wider">Respuesta de MotoPolish</p>
                        <p className="text-gray-300 text-sm pr-12">{rev.adminReply}</p>
                        
                        {isAdmin && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity bg-zinc-900/50 backdrop-blur-sm p-1 rounded-lg border border-yellow-500/20">
                            <button 
                              onClick={() => handleEditReply(rev)}
                              className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors"
                              title="Editar Respuesta"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => setDeleteData({ id: rev.id, type: 'reply' })}
                              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                              title="Eliminar Respuesta"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : isAdmin && replyingTo !== rev.id ? (
                      <button 
                        onClick={() => setReplyingTo(rev.id)}
                        className="text-sm text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-1 mt-2"
                      >
                        <Send size={14} /> Responder
                      </button>
                    ) : null}

                    {/* Formulario de Respuesta (Admin) */}
                    {isAdmin && replyingTo === rev.id && (
                      <div className="mt-4 flex gap-2">
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Escribe tu respuesta pública..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                        />
                        <button 
                          onClick={() => handleReplySubmit(rev.id)}
                          className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400 text-sm transition-colors"
                        >
                          Enviar
                        </button>
                        <button 
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          className="bg-white/5 text-gray-400 px-4 py-2 rounded-xl font-bold hover:bg-white/10 hover:text-white text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar Reseña (Solo Cliente) */}
      {isModalOpen && !isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <button 
              onClick={resetForm}
              className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full p-2 transition-all"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {editingId ? 'Editar Reseña' : 'Califica nuestro servicio'}
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              Tu opinión es muy importante para nosotros y para futuros clientes.
            </p>
            
            <form onSubmit={handleSaveReview} className="space-y-6">
              <div className="flex flex-col items-center justify-center py-4 bg-black/20 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-400 mb-3 font-medium">Selecciona una puntuación</p>
                <StarRating currentRating={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Cuéntanos tu experiencia</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="¿Qué te pareció el servicio? ¿Cómo quedó tu vehículo?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500 resize-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-4 py-3 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 transition-all flex justify-center items-center shadow-lg shadow-yellow-500/20"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Publicar Reseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteData(null)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {deleteData.type === 'review' ? '¿Eliminar Reseña?' : '¿Eliminar Respuesta?'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Esta acción no se puede deshacer. 
              {deleteData.type === 'review' 
                ? ' La reseña se borrará permanentemente.' 
                : ' Tu respuesta será eliminada del comentario.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteData(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-400 transition-colors shadow-lg shadow-red-500/20 text-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
