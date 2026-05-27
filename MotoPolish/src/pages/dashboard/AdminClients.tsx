import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Users, Search, Loader2 } from 'lucide-react';

interface UserData {
  uid: string;
  nombre: string;
  email: string;
  role: string;
  fechaCreacion?: any;
}

export default function AdminClients() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obtenemos los usuarios ordenados por fecha de creación (los más recientes primero)
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

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header de la sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-yellow-500" />
            Directorio de Clientes
          </h1>
          <p className="text-gray-400">Gestiona todos los usuarios registrados en la plataforma.</p>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600 shadow-inner"
          />
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">Nombre Completo</th>
                  <th className="p-5 font-semibold">Correo Electrónico</th>
                  <th className="p-5 font-semibold">Rol</th>
                  <th className="p-5 font-semibold">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="font-medium text-white group-hover:text-yellow-500 transition-colors">
                        {user.nombre}
                      </div>
                    </td>
                    <td className="p-5 text-gray-400">{user.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-gray-400 text-sm">
                      {user.fechaCreacion 
                        ? new Date(user.fechaCreacion.toDate()).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
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
