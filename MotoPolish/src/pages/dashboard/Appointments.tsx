import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Calendar, Clock, Check, X, AlertCircle, Loader2, CalendarClock, ArrowRight } from 'lucide-react';

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt?: any;
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const STATUS_UI = {
  pending: { label: 'En Espera de Aprobación', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  approved: { label: 'Aprobada', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Rechazada', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelled: { label: 'Cancelada', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
};

export default function Appointments() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para Modales Personalizados
  const [alertModal, setAlertModal] = useState<{isOpen: boolean, type: 'success' | 'error' | 'info', message: string}>({isOpen: false, type: 'info', message: ''});
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, appt: Appointment | null}>({isOpen: false, appt: null});

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    time: '08:00',
    reason: ''
  });

  // Fecha mínima permitida (Hoy)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAppointments();
  }, [user, isAdmin]);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let qAppt;
      if (isAdmin) {
        // Admin ve TODO, ordenado por fecha de cita
        qAppt = query(collection(db, 'appointments'));
      } else {
        // Cliente ve solo las suyas
        qAppt = query(collection(db, 'appointments'), where('clientId', '==', user.uid));
      }
      
      const snap = await getDocs(qAppt);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      
      // Ordenamos en cliente para no forzar índices compuestos en Firebase
      data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validación: Verificar si ya existe una cita APROBADA para esa fecha y hora
    const isTaken = appointments.some(appt => 
      appt.date === formData.date && 
      appt.time === formData.time && 
      appt.status === 'approved'
    );

    if (isTaken) {
      return setAlertModal({isOpen: true, type: 'error', message: 'Lo sentimos, ya hay un agendamiento aprobado para esa fecha y hora. Por favor, selecciona otro horario.'});
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        clientId: user.uid,
        clientName: user.displayName || 'Usuario',
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setAlertModal({isOpen: true, type: 'success', message: 'Solicitud enviada correctamente. El administrador la revisará pronto.'});
      setFormData({ date: '', time: '08:00', reason: '' });
      fetchAppointments();
    } catch (error) {
      console.error("Error al agendar:", error);
      setAlertModal({isOpen: true, type: 'error', message: 'Hubo un error al procesar tu solicitud.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (appt: Appointment, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appt.id), { status: newStatus });
      
      // Si el cliente cancela, notificar al admin (esto asume que el admin leerá notificaciones o es un registro, 
      // para simplificar guardamos una notificacion 'global' o para admins. En este esquema, creamos notificacion para userId = 'admin_general'
      // O simplemente se ve en el dashboard admin. Como el admin no tiene panel de notificaciones actual, el estado simplemente cambia.
      // Pero el cliente pidió: "que le llegue la notificacion del cancelamiento al admin".
      // Crearemos la notificacion y si despues hacemos panel para el admin la verá.
      if (newStatus === 'cancelled' && !isAdmin) {
         // Notificamos a los admins (buscamos un admin o creamos una generica)
         await addDoc(collection(db, 'notifications'), {
           userId: 'admin_role', // Marcador para notificaciones globales de admin
           title: 'Cita Cancelada',
           message: `El cliente ${appt.clientName} ha cancelado su cita del ${appt.date} a las ${appt.time}.`,
           read: false,
           createdAt: serverTimestamp()
         });
      }

      // Si el admin aprueba/rechaza, notificar al cliente
      if (isAdmin) {
         const estadoTxt = newStatus === 'approved' ? 'APROBADA' : 'RECHAZADA';
         await addDoc(collection(db, 'notifications'), {
           userId: appt.clientId,
           title: `Agendamiento ${estadoTxt}`,
           message: `Tu solicitud de cita para el ${appt.date} a las ${appt.time} ha sido ${estadoTxt.toLowerCase()}.`,
           read: false,
           createdAt: serverTimestamp()
         });
      }

      // Actualizar local
      setAppointments(appointments.map(a => a.id === appt.id ? { ...a, status: newStatus as any } : a));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancelByClient = (appt: Appointment) => {
    // Validar mínimo 24h
    const appointmentDate = new Date(`${appt.date}T${appt.time}:00`);
    const now = new Date();
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      setAlertModal({isOpen: true, type: 'error', message: 'No puedes cancelar una cita con menos de 24 horas de antelación. Por favor comunícate directamente con el taller.'});
      return;
    }

    setConfirmModal({isOpen: true, appt});
  };

  const executeCancel = () => {
    if (confirmModal.appt) {
      updateStatus(confirmModal.appt, 'cancelled');
      setConfirmModal({isOpen: false, appt: null});
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Calendar className="text-yellow-500" />
          Calendario y Agendamientos
        </h1>
        <p className="text-gray-400">
          {isAdmin 
            ? 'Gestiona, aprueba o rechaza las solicitudes de citas de tus clientes.' 
            : 'Reserva tu espacio en el taller. Todas las solicitudes requieren confirmación.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Agendamiento (Solo Cliente) */}
        {!isAdmin && (
          <div className="lg:col-span-1 h-fit bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <CalendarClock className="text-yellow-500" size={20} />
              Solicitar Nueva Cita
            </h2>
            
            <form onSubmit={handleRequestAppointment} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Fecha Deseada *</label>
                <input 
                  type="date" 
                  required
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Hora de Llegada *</label>
                <select 
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Motivo del Agendamiento *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Ej: Evaluación para pintura, Lavado Premium, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none resize-none transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !formData.date || !formData.reason}
                className="w-full px-4 py-3.5 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {isSubmitting ? 'Procesando...' : 'Solicitar Agendamiento'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de Agendamientos */}
        <div className={`bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl ${!isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="p-6 border-b border-white/5 bg-zinc-950/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-yellow-500" size={20} />
              {isAdmin ? 'Calendario General' : 'Tus Agendamientos'}
            </h2>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Loader2 className="animate-spin mb-4 text-yellow-500" size={32} />
                Cargando calendario...
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-white mb-1">No hay citas registradas</p>
                <p className="text-sm">
                  {isAdmin ? 'Nadie ha solicitado citas aún.' : 'Utiliza el formulario para agendar tu primera visita.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto relative">
                <div className="md:hidden text-[10px] text-yellow-500 mb-2 flex items-center justify-end gap-1 font-medium uppercase tracking-wider px-4 mt-2">
                  Desliza para ver más <ArrowRight size={12} />
                </div>
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Fecha y Hora</th>
                      {isAdmin && <th className="p-4 font-semibold">Cliente</th>}
                      <th className="p-4 font-semibold">Motivo</th>
                      <th className="p-4 font-semibold">Estado</th>
                      <th className="p-4 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appointments.map((appt) => {
                      const ui = STATUS_UI[appt.status];
                      
                      // Evaluamos si es una fecha pasada
                      const isPast = new Date(`${appt.date}T${appt.time}:00`).getTime() < new Date().getTime();

                      return (
                        <tr key={appt.id} className={`hover:bg-white/[0.02] transition-colors ${isPast && appt.status !== 'cancelled' ? 'opacity-50' : ''}`}>
                          <td className="p-4">
                            <div className="font-bold text-white tracking-wider flex items-center gap-2">
                              {appt.date} <span className="text-yellow-500 font-mono text-sm">{appt.time}</span>
                            </div>
                            {isPast && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 block">Pasada</span>}
                          </td>
                          {isAdmin && (
                            <td className="p-4 text-gray-300 font-medium">
                              {appt.clientName}
                            </td>
                          )}
                          <td className="p-4 text-gray-400 text-sm max-w-xs truncate" title={appt.reason}>
                            {appt.reason}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ui.color}`}>
                              {ui.label}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isAdmin ? (
                                // ACCIONES ADMIN
                                appt.status === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => updateStatus(appt, 'approved')}
                                      className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                                      title="Aprobar Cita"
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button 
                                      onClick={() => updateStatus(appt, 'rejected')}
                                      className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                                      title="Rechazar Cita"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )
                              ) : (
                                // ACCIONES CLIENTE
                                (appt.status === 'approved' || appt.status === 'pending') && !isPast && (
                                  <button 
                                    onClick={() => handleCancelByClient(appt)}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 text-xs font-bold flex items-center gap-1"
                                  >
                                    <X size={14} /> Cancelar
                                  </button>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL ALERTA PERSONALIZADA */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAlertModal({isOpen: false, type: 'info', message: ''})} />
          <div className={`relative bg-zinc-900 border rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center ${
            alertModal.type === 'error' ? 'border-red-500/20 shadow-red-500/10' : 'border-green-500/20 shadow-green-500/10'
          }`}>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
              alertModal.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
            }`}>
              {alertModal.type === 'error' ? <AlertCircle size={32} /> : <Check size={32} />}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3">
              {alertModal.type === 'error' ? 'Acción Denegada' : '¡Éxito!'}
            </h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {alertModal.message}
            </p>
            
            <button 
              onClick={() => setAlertModal({isOpen: false, type: 'info', message: ''})}
              className={`w-full px-4 py-3 rounded-xl font-bold text-white transition-colors ${
                alertModal.type === 'error' ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION ELIMINAR */}
      {confirmModal.isOpen && confirmModal.appt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmModal({isOpen: false, appt: null})} />
          <div className="relative bg-zinc-900 border border-red-500/20 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
              <AlertCircle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">¿Cancelar Cita?</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Estás a punto de cancelar tu cita del <strong className="text-white">{confirmModal.appt.date}</strong> a las <strong className="text-white">{confirmModal.appt.time}</strong>.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({isOpen: false, appt: null})}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                Volver
              </button>
              <button 
                onClick={executeCancel}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
