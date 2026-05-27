import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Users, Search, Loader2, FileDown, Phone, MapPin, Car, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';

interface UserData {
  uid: string;
  nombre: string;
  email: string;
  role: string;
  fechaCreacion?: any;
  telefono?: string;
  edad?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nacionalidad?: string;
  direccion?: string;
  tieneVehiculos?: string;
  cuantosVehiculos?: string;
  tiposVehiculos?: string;
}

export default function AdminClients() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('fechaCreacion', 'desc'));
        const querySnapshot = await getDocs(q);
        const usersList: UserData[] = [];
        
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data() as UserData);
        });
        
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- EXPORTAR A EXCEL ---
  const exportAllToExcel = () => {
    if (users.length === 0) return alert('No hay clientes para exportar');
    
    const dataToExport = users.map(user => {
       const fecha = user.fechaCreacion ? new Date(user.fechaCreacion.toDate()).toLocaleString('es-CO') : 'N/A';
       return {
         'ID Sistema': user.uid,
         'Nombre Completo': user.nombre,
         'Correo Electrónico': user.email,
         'Teléfono': user.telefono || 'No registrado',
         'Edad': user.edad || 'No registrada',
         'Tipo Doc.': user.tipoDocumento || 'N/A',
         'Nº Documento': user.numeroDocumento || 'No registrado',
         'Nacionalidad': user.nacionalidad || 'N/A',
         'Dirección': user.direccion || 'No registrada',
         '¿Tiene Vehículos?': user.tieneVehiculos || 'N/A',
         'Cant. Vehículos': user.cuantosVehiculos || '0',
         'Tipos Vehículos': user.tiposVehiculos || 'N/A',
         'Rol': user.role.toUpperCase(),
         'Fecha de Registro': fecha
       };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes MotoPolish');
    const fileName = `MotoPolish_Clientes_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.numeroDocumento && user.numeroDocumento.includes(searchTerm))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-yellow-500" />
            Directorio de Clientes
          </h1>
          <p className="text-gray-400">Consulta la base de datos detallada de todos los usuarios.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nombre, correo o cédula..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-inner"
            />
          </div>
          
          <button 
            onClick={exportAllToExcel}
            title="Exportar Base de Datos a Excel"
            className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-green-600/30 hover:shadow-lg hover:shadow-green-600/20 whitespace-nowrap"
          >
            <FileDown size={20} />
            <span className="hidden sm:inline">Exportar a Excel</span>
          </button>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
            <p className="font-medium">Cargando directorio de clientes...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            <Users size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium text-white mb-1 text-xl">No se encontraron resultados</p>
            <p className="text-sm max-w-md mx-auto">
              {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Aún no hay clientes registrados en la plataforma.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <div className="md:hidden text-[10px] text-yellow-500 mb-2 flex items-center justify-end gap-1 font-medium uppercase tracking-wider px-4 mt-2">
              Desliza para ver más <ArrowRight size={12} />
            </div>
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">Perfil del Cliente</th>
                  <th className="p-5 font-semibold">Documento y Contacto</th>
                  <th className="p-5 font-semibold">Ubicación</th>
                  <th className="p-5 font-semibold">Flotilla de Vehículos</th>
                  <th className="p-5 font-semibold">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-lg group-hover:text-yellow-500 transition-colors">
                          {user.nombre}
                        </span>
                        <span className="text-sm text-gray-400 mt-1">{user.email}</span>
                        <span className="text-xs text-gray-500 mt-2 font-mono">
                          Reg: {user.fechaCreacion ? new Date(user.fechaCreacion.toDate()).toLocaleDateString('es-CO') : 'Desconocida'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex flex-col space-y-2">
                        {user.numeroDocumento ? (
                          <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 w-fit px-2 py-1 rounded">
                            <span className="text-yellow-500 font-bold">{user.tipoDocumento}:</span> {user.numeroDocumento}
                          </div>
                        ) : <span className="text-sm text-gray-500 italic">Doc. no registrado</span>}
                        
                        {user.telefono ? (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone size={14} className="text-gray-500" /> {user.telefono}
                          </div>
                        ) : <span className="text-sm text-gray-500 italic">Tel. no registrado</span>}

                        {user.edad && (
                          <div className="text-xs text-gray-500">
                            Edad: <span className="text-gray-300">{user.edad} años</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-5">
                       <div className="flex flex-col space-y-2 text-sm text-gray-300">
                          {user.nacionalidad ? (
                            <span><span className="text-gray-500">Nac:</span> {user.nacionalidad}</span>
                          ) : <span className="text-gray-500 italic">Nac. no registrada</span>}

                          {user.direccion ? (
                            <div className="flex items-start gap-2 max-w-[200px]">
                              <MapPin size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                              <span className="truncate" title={user.direccion}>{user.direccion}</span>
                            </div>
                          ) : <span className="text-gray-500 italic">Dir. no registrada</span>}
                       </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col space-y-1">
                        {user.tieneVehiculos === 'Si' ? (
                          <>
                            <div className="flex items-center gap-2 text-sm text-white font-medium">
                              <Car size={16} className="text-yellow-500" />
                              {user.cuantosVehiculos} Vehículo(s)
                            </div>
                            <span className="text-xs text-gray-400 bg-zinc-950 px-2 py-1 rounded w-fit border border-white/5">
                              {user.tiposVehiculos}
                            </span>
                          </>
                        ) : user.tieneVehiculos === 'No' ? (
                          <span className="text-sm text-gray-500 bg-white/5 px-2 py-1 rounded w-fit">No posee vehículos</span>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Sin datos de vehículos</span>
                        )}
                      </div>
                    </td>

                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
