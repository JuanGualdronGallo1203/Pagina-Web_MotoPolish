import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Briefcase, Plus, Search, Loader2, X, AlertCircle, Edit2, Trash2, CalendarClock, Users, FileDown, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface JobData {
  id: string;
  clientId: string;
  clientName: string;
  vehiclePlate: string;
  vehicleType: string;
  vehicleColor: string;
  serviceType: string;
  status: string;
  price: number;
  observaciones: string;
  fechaCreacion?: any;
  fechaEstado?: any;
}

interface UserData {
  uid: string;
  nombre: string;
}

const JOB_STATUSES = [
  { id: 'recibido', label: '📥 Recibido en Taller', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  { id: 'evaluacion', label: '🔍 En Evaluación', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'cotizacion', label: '📋 Cotización Enviada', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'aprobado', label: '👍 Trabajo Aprobado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'en_proceso', label: '⚙️ En Proceso', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'detalles', label: '✨ Detalles Finales', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { id: 'terminado', label: '✅ Terminado / Listo', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { id: 'entregado', label: '🤝 Entregado al Cliente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { id: 'cancelado', label: '❌ Cancelado', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

const VEHICLE_TYPES = [
  'Motocicleta', 'Automóvil', 'Camioneta / SUV', 'Pick-up', 'Scooter', 'Bicicleta', 'Otro'
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [clients, setClients] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  
  // Confirm Delete state
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    vehiclePlate: '',
    vehicleType: 'Motocicleta',
    vehicleColor: '',
    serviceType: '',
    price: '',
    observaciones: '',
    status: 'recibido'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clientsSnapshot = await getDocs(query(collection(db, 'users')));
      const clientsList: UserData[] = [];
      clientsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'client') clientsList.push({ uid: doc.id, nombre: data.nombre });
      });
      setClients(clientsList);

      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), orderBy('fechaCreacion', 'desc')));
      const jobsList: JobData[] = [];
      jobsSnapshot.forEach((doc) => {
        jobsList.push({ id: doc.id, ...doc.data() } as JobData);
      });
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    if (!rawValue) {
      setFormData({ ...formData, price: '' });
      return;
    }
    const formatted = new Intl.NumberFormat('es-CO').format(parseInt(rawValue, 10));
    setFormData({ ...formData, price: formatted });
  };

  const handleStatusChange = async (job: JobData, newStatus: string) => {
    try {
      const statusLabel = JOB_STATUSES.find(s => s.id === newStatus)?.label || newStatus;
      
      await updateDoc(doc(db, 'jobs', job.id), { 
        status: newStatus,
        fechaEstado: serverTimestamp()
      });
      
      await addDoc(collection(db, 'notifications'), {
        userId: job.clientId,
        title: 'Estado Actualizado',
        message: `El estado de tu vehículo placa ${job.vehiclePlate.toUpperCase()} ha cambiado a: ${statusLabel}`,
        read: false,
        createdAt: serverTimestamp()
      });

      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus, fechaEstado: Timestamp.now() } : j));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Hubo un error al actualizar el estado");
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'jobs', jobToDelete.id));
      setJobs(jobs.filter(j => j.id !== jobToDelete.id));
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Hubo un error al eliminar el trabajo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (job: JobData) => {
    setFormData({
      clientId: job.clientId,
      clientName: job.clientName,
      vehiclePlate: job.vehiclePlate,
      vehicleType: job.vehicleType,
      vehicleColor: job.vehicleColor || '',
      serviceType: job.serviceType,
      observaciones: job.observaciones || '',
      price: new Intl.NumberFormat('es-CO').format(job.price),
      status: job.status
    });
    setEditingJobId(job.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      clientId: '', clientName: '', vehiclePlate: '', vehicleType: 'Motocicleta', 
      vehicleColor: '', serviceType: '', price: '', observaciones: '', status: 'recibido'
    });
    setEditingJobId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) return alert("Selecciona un cliente");
    
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.uid === formData.clientId);
      const rawPrice = Number(formData.price.replace(/\D/g, ''));
      
      const jobPayload = {
        ...formData,
        clientName: selectedClient?.nombre || 'Desconocido',
        price: rawPrice,
      };

      if (editingJobId) {
        await updateDoc(doc(db, 'jobs', editingJobId), jobPayload);
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...jobPayload,
          fechaCreacion: serverTimestamp(),
          fechaEstado: serverTimestamp() 
        });
        
        const statusLabel = JOB_STATUSES.find(s => s.id === formData.status)?.label || formData.status;
        await addDoc(collection(db, 'notifications'), {
          userId: formData.clientId,
          title: 'Nuevo Trabajo Registrado',
          message: `Se ha registrado el ingreso de tu vehículo ${formData.vehiclePlate.toUpperCase()}. Estado actual: ${statusLabel}`,
          read: false,
          createdAt: serverTimestamp()
        });
      }

      resetForm();
      fetchData(); 
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Hubo un error al guardar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Funciones de Excel ----
  const formatJobForExcel = (job: JobData) => {
    const statusObj = JOB_STATUSES.find(s => s.id === job.status);
    const dateCreate = job.fechaCreacion ? new Date(job.fechaCreacion.toDate()).toLocaleString('es-CO') : 'N/A';
    const dateStatus = job.fechaEstado ? new Date(job.fechaEstado.toDate()).toLocaleString('es-CO') : 'N/A';
    // Quitamos los emojis del estado para el Excel
    const cleanStatus = statusObj ? statusObj.label.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '').trim() : job.status;

    return {
      'ID Registro': job.id,
      'Cliente': job.clientName,
      'Vehículo': job.vehicleType,
      'Color': job.vehicleColor || 'N/A',
      'Placa': job.vehiclePlate.toUpperCase(),
      'Servicio a Realizar': job.serviceType,
      'Observaciones': job.observaciones || 'N/A',
      'Precio Base (COP)': job.price,
      'Estado Actual': cleanStatus,
      'Fecha Ingreso': dateCreate,
      'Última Modificación': dateStatus
    };
  };

  const exportAllToExcel = () => {
    if (jobs.length === 0) return alert('No hay trabajos para exportar');
    const dataToExport = jobs.map(formatJobForExcel);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trabajos Totales');
    const fileName = `MotoPolish_Reporte_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportSingleToExcel = (job: JobData) => {
    const dataToExport = [formatJobForExcel(job)];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalle Trabajo');
    const fileName = `Trabajo_${job.vehiclePlate.toUpperCase()}_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const filteredJobs = jobs.filter(job => 
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Briefcase className="text-yellow-500" />
            Gestión de Trabajos
          </h1>
          <p className="text-gray-400">Controla los vehículos, servicios e historial de estados en tiempo real.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar placa o cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={exportAllToExcel}
              title="Exportar Todo a Excel"
              className="flex items-center justify-center bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white px-4 py-2.5 rounded-xl transition-all border border-green-600/30 hover:shadow-lg hover:shadow-green-600/20"
            >
              <FileDown size={20} />
            </button>
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Ingreso</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
            <p className="font-medium">Cargando base de datos de trabajos...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            <Briefcase size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium text-white mb-1 text-xl">No hay trabajos registrados</p>
            <p className="text-sm">Inicia creando un nuevo trabajo para un cliente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">Vehículo y Cliente</th>
                  <th className="p-5 font-semibold">Servicio a Realizar</th>
                  <th className="p-5 font-semibold">Precio</th>
                  <th className="p-5 font-semibold">Estado y Fecha</th>
                  <th className="p-5 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredJobs.map((job) => {
                  const currentStatus = JOB_STATUSES.find(s => s.id === job.status) || JOB_STATUSES[0];
                  
                  return (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold tracking-widest text-lg bg-zinc-800 px-2 py-0.5 rounded border border-white/10">
                              {job.vehiclePlate.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400 uppercase bg-white/5 px-2 py-1 rounded-full border border-white/5">
                              {job.vehicleType} {job.vehicleColor ? `• ${job.vehicleColor}` : ''}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                             Dueño: <span className="text-gray-300 font-medium">{job.clientName}</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-gray-300">
                        <div className="flex flex-col">
                          <span className="font-medium text-white mb-1">{job.serviceType}</span>
                          {job.observaciones && (
                            <span className="text-xs text-gray-500 line-clamp-2 max-w-xs italic" title={job.observaciones}>
                              "{job.observaciones}"
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-yellow-500 font-mono font-bold whitespace-nowrap text-lg">
                        ${job.price.toLocaleString('es-CO')}
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2">
                          <select 
                            value={job.status}
                            onChange={(e) => handleStatusChange(job, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer outline-none border transition-colors ${currentStatus.color}`}
                          >
                            {JOB_STATUSES.map(status => (
                              <option key={status.id} value={status.id} className="bg-zinc-900 text-white">
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1 text-xs text-gray-500 ml-1" title="Última actualización de estado">
                            <CalendarClock size={12} />
                            {job.fechaEstado 
                              ? new Date(job.fechaEstado.toDate()).toLocaleDateString('es-CO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
                              : 'Actualizado hace poco'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => exportSingleToExcel(job)}
                            className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                            title="Descargar Ficha en Excel"
                          >
                            <FileDown size={16} />
                          </button>
                          <button 
                            onClick={() => openEditModal(job)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20"
                            title="Editar Trabajo"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setJobToDelete(job)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                            title="Eliminar Trabajo"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Modal Confirmación Eliminación */}
      {jobToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setJobToDelete(null)} />
          <div className="relative bg-zinc-900 border border-red-500/20 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">¿Eliminar Trabajo?</h2>
            <p className="text-gray-400 mb-2">
              Estás a punto de borrar permanentemente la orden del vehículo <strong className="text-white">{jobToDelete.vehiclePlate.toUpperCase()}</strong>.
            </p>
            <p className="text-red-400 text-sm font-medium mb-8 bg-red-500/10 py-2 rounded-lg">
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setJobToDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 flex justify-center items-center"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={20} /> : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Trabajo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={resetForm}
              className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full p-2 transition-all"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {editingJobId ? 'Editar Orden de Trabajo' : 'Registrar Nuevo Ingreso'}
            </h2>
            <p className="text-gray-400 mb-8 text-sm border-b border-white/5 pb-4">
              Completa los detalles del vehículo y el servicio a realizar.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Sección Cliente */}
              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                  <Users size={14} /> Datos del Cliente
                </h3>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Seleccionar Propietario *</label>
                  <select 
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                  >
                    <option value="">Buscar cliente registrado...</option>
                    {clients.map(client => (
                      <option key={client.uid} value={client.uid}>{client.nombre}</option>
                    ))}
                  </select>
                  {clients.length === 0 && (
                    <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2 p-2 bg-red-500/10 rounded-lg">
                      <AlertCircle size={14} /> No hay clientes registrados. Pide al cliente que se registre en la web.
                    </p>
                  )}
                </div>
              </div>

              {/* Sección Vehículo */}
              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                   🚗 Especificaciones del Vehículo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Tipo *</label>
                    <select 
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                    >
                      {VEHICLE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Placa *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: ABC-12D"
                      value={formData.vehiclePlate}
                      onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white uppercase focus:border-yellow-500 outline-none placeholder:normal-case placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Color</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Rojo Perla"
                      value={formData.vehicleColor}
                      onChange={(e) => setFormData({...formData, vehicleColor: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Servicio */}
              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                   🛠️ Detalles del Servicio
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Servicio Principal a Realizar *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Restauración de Color + Porcelanizado"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none placeholder:text-zinc-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Observaciones / Diagnóstico Inicial</label>
                  <textarea 
                    rows={3}
                    placeholder="Detalles sobre rayones profundos, estado de la pintura, requerimientos especiales del cliente..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none placeholder:text-zinc-600 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Precio (COP) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: 150.000"
                        value={formData.price}
                        onChange={handlePriceChange}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:border-yellow-500 outline-none placeholder:text-zinc-600 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Estado Actual</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors font-medium"
                    >
                      {JOB_STATUSES.map(status => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || clients.length === 0}
                  className="flex-[2] px-4 py-4 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-50 flex justify-center items-center gap-2 hover:-translate-y-0.5"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (editingJobId ? 'Guardar Cambios' : 'Crear Orden de Trabajo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
