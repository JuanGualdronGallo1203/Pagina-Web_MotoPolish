import { useAuth } from '../../context/AuthContext';
import { Briefcase, Clock, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Overview() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          ¡Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-400">
          {isAdmin 
            ? 'Bienvenido al panel de control. Aquí tienes un resumen de la actividad del taller.' 
            : 'Bienvenido a tu panel personal. Aquí puedes hacer seguimiento al estado de tus vehículos.'}
        </p>
      </div>

      {/* Tarjetas de Resumen (Mocks estáticos por ahora) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={isAdmin ? "Trabajos Activos" : "Mis Trabajos"} 
          value="0" 
          icon={Briefcase} 
          color="text-yellow-500" 
          bg="bg-yellow-500/10" 
        />
        <StatCard 
          title="En Proceso" 
          value="0" 
          icon={Clock} 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Completados" 
          value="0" 
          icon={CheckCircle} 
          color="text-green-500" 
          bg="bg-green-500/10" 
        />
        {isAdmin && (
          <StatCard 
            title="Facturas Pendientes" 
            value="0" 
            icon={FileText} 
            color="text-red-500" 
            bg="bg-red-500/10" 
          />
        )}
      </div>

      {/* Espacio para la tabla de actividad reciente */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
        <div className="text-center py-12 text-gray-500 bg-zinc-950/50 rounded-xl border border-white/5 border-dashed">
          <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium text-white mb-1">Aún no hay actividad registrada</p>
          <p className="text-sm">Pronto conectaremos esta sección con la base de datos en tiempo real.</p>
        </div>
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
      className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center gap-4 transition-all hover:border-white/10"
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
