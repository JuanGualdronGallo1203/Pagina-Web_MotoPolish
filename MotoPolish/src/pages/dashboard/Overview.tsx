import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Clock, CheckCircle, FileText, Bell, Car, Info, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Helper de estados para mostrar el color correcto
const getStatusLabel = (statusId: string) => {
  const map: any = {
    'recibido': { label: 'Recibido', color: 'text-zinc-400 bg-zinc-500/10' },
    'evaluacion': { label: 'En Evaluación', color: 'text-purple-400 bg-purple-500/10' },
    'cotizacion': { label: 'Cotización', color: 'text-orange-400 bg-orange-500/10' },
    'aprobado': { label: 'Aprobado', color: 'text-emerald-400 bg-emerald-500/10' },
    'en_proceso': { label: 'En Proceso', color: 'text-blue-400 bg-blue-500/10' },
    'detalles': { label: 'Detalles Finales', color: 'text-pink-400 bg-pink-500/10' },
    'terminado': { label: 'Terminado', color: 'text-green-500 bg-green-500/10' },
    'entregado': { label: 'Entregado', color: 'text-yellow-500 bg-yellow-500/10' },
    'cancelado': { label: 'Cancelado', color: 'text-red-500 bg-red-500/10' },
  };
  return map[statusId] || { label: statusId, color: 'text-gray-400 bg-gray-500/10' };
};

export default function Overview() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  const [jobs, setJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        // Fetch Jobs
        let jobsData: any[] = [];
        if (isAdmin) {
          // Admin ve los últimos trabajos (max 20 para el resumen)
          const qJobs = query(collection(db, 'jobs'), orderBy('fechaCreacion', 'desc'), limit(20));
          const snap = await getDocs(qJobs);
          jobsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } else {
          // Cliente ve SOLO sus trabajos
          const qJobs = query(collection(db, 'jobs'), where('clientId', '==', user.uid));
          const snap = await getDocs(qJobs);
          jobsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          // Ordenamos manualmente para no requerir índice compuesto en Firestore
          jobsData.sort((a, b) => (b.fechaCreacion?.seconds || 0) - (a.fechaCreacion?.seconds || 0));
        }
        setJobs(jobsData);

        // Fetch Notificaciones (Solo para Clientes)
        if (!isAdmin) {
          const qNotif = query(collection(db, 'notifications'), where('userId', '==', user.uid));
          const notifSnap = await getDocs(qNotif);
          let notifData = notifSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          notifData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setNotifications(notifData.slice(0, 10)); // Mostrar las últimas 10
        }

      } catch (err) {
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  // Acciones de Notificaciones
  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };

  // Cálculos dinámicos
  const totalJobs = jobs.length;
  const inProcessJobs = jobs.filter(j => ['recibido', 'evaluacion', 'en_proceso', 'detalles'].includes(j.status)).length;
  const completedJobs = jobs.filter(j => ['terminado', 'entregado'].includes(j.status)).length;
  
  const revenue = isAdmin 
    ? jobs.reduce((acc, j) => acc + (j.price || 0), 0)
    : jobs.filter(j => j.status !== 'cancelado' && j.status !== 'entregado').reduce((acc, j) => acc + (j.price || 0), 0);

  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          ¡Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-400">
          {isAdmin 
            ? 'Resumen en tiempo real de la actividad general de tu taller MotoPolish.' 
            : 'Tu panel personal. Aquí puedes hacer seguimiento detallado al estado de tus vehículos.'}
        </p>
      </div>

      {/* Tarjetas de Estadísticas Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={isAdmin ? "Total Órdenes" : "Mis Vehículos"} 
          value={loading ? "..." : totalJobs.toString()} 
          icon={isAdmin ? Briefcase : Car} 
          color="text-yellow-500" 
          bg="bg-yellow-500/10" 
        />
        <StatCard 
          title="En Taller / Proceso" 
          value={loading ? "..." : inProcessJobs.toString()} 
          icon={Clock} 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Completados" 
          value={loading ? "..." : completedJobs.toString()} 
          icon={CheckCircle} 
          color="text-green-500" 
          bg="bg-green-500/10" 
        />
        <StatCard 
          title={isAdmin ? "Valor Total Proyectado" : "Pendiente por Pagar"} 
          value={loading ? "..." : `$${revenue.toLocaleString('es-CO')}`} 
          icon={FileText} 
          color={isAdmin ? "text-emerald-500" : "text-red-500"} 
          bg={isAdmin ? "bg-emerald-500/10" : "bg-red-500/10"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Trabajos */}
        <div className={`bg-zinc-900 border border-white/5 rounded-2xl p-6 ${isAdmin ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="text-yellow-500" size={24} />
              {isAdmin ? 'Últimos Trabajos Registrados' : 'Estado de tus Vehículos'}
            </h2>
          </div>

          {loading ? (
             <div className="text-center py-12 text-gray-500">Cargando datos...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-zinc-950/50 rounded-xl border border-white/5 border-dashed">
              <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium text-white mb-1">Aún no hay trabajos registrados</p>
              <p className="text-sm">
                {isAdmin ? 'Ve a la pestaña de Trabajos para crear el primero.' : 'Cuando el taller registre tu ingreso, aparecerá aquí.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto relative">
              <div className="md:hidden text-[10px] text-yellow-500 mb-2 flex items-center justify-end gap-1 font-medium uppercase tracking-wider px-4 mt-2">
                Desliza para ver más <ArrowRight size={12} />
              </div>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-sm">
                    {isAdmin && <th className="pb-3 font-semibold">Cliente</th>}
                    <th className="pb-3 font-semibold">Vehículo</th>
                    <th className="pb-3 font-semibold">Servicio</th>
                    <th className="pb-3 font-semibold">Estado Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.slice(0, 10).map((job) => {
                    const statusUI = getStatusLabel(job.status);
                    return (
                      <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                        {isAdmin && <td className="py-4 text-white font-medium">{job.clientName}</td>}
                        <td className="py-4">
                          <span className="font-bold text-white tracking-widest">{job.vehiclePlate.toUpperCase()}</span>
                          <span className="block text-xs text-gray-500">{job.vehicleType}</span>
                        </td>
                        <td className="py-4 text-gray-400">{job.serviceType}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusUI.color}`}>
                            {statusUI.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Panel de Notificaciones Exclusivo para Clientes */}
        {!isAdmin && (
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 lg:col-span-1 flex flex-col h-full max-h-[500px]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="text-yellow-500" size={24} />
              Notificaciones
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Cargando...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Bell size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No tienes notificaciones recientes.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 rounded-xl border relative transition-all group ${notif.read ? 'bg-zinc-950/50 border-white/5 opacity-70' : 'bg-zinc-900 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]'}`}>
                    
                    {/* Punto amarillo de no leído */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    )}

                    <div className="pr-2">
                      <h4 className={`text-sm font-bold flex items-center gap-2 mb-1 ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                        <Info size={14} className={notif.read ? "text-gray-500" : "text-yellow-500"} />
                        {notif.title}
                      </h4>
                      <p className={`text-xs leading-relaxed mb-3 ${notif.read ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                        <span className="text-[10px] text-gray-600 font-mono">
                          {notif.createdAt ? new Date(notif.createdAt.toDate()).toLocaleString('es-CO') : 'Reciente'}
                        </span>
                        
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-[10px] flex items-center gap-1 text-yellow-500 hover:text-white bg-yellow-500/10 hover:bg-yellow-500 px-2 py-1 rounded transition-colors"
                              title="Marcar como leída"
                            >
                              <Check size={12} /> Leído
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="text-[10px] flex items-center gap-1 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 px-2 py-1 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={12} /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para las tarjetas pequeñas (Widgets)
function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center gap-4 transition-all hover:border-white/10 hover:bg-zinc-900/80 shadow-lg"
    >
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}
