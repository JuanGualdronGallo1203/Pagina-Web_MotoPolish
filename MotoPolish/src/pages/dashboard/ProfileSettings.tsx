import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User, Lock, Save, AlertCircle, Loader2, Settings, ShieldCheck } from 'lucide-react';

export default function ProfileSettings() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';
  
  // Estados para el Nombre
  const [nombre, setNombre] = useState(user?.displayName || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameMsg, setNameMsg] = useState({ type: '', text: '' });

  // Estados para la Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingName(true);
    setNameMsg({ type: '', text: '' });
    try {
      // 1. Actualizar en Firebase Auth
      await updateProfile(user, { displayName: nombre });
      // 2. Actualizar en la colección users
      await updateDoc(doc(db, 'users', user.uid), { nombre });
      
      setNameMsg({ type: 'success', text: 'Tus datos se actualizaron correctamente.' });
      setTimeout(() => setNameMsg({ type: '', text: '' }), 4000);
    } catch (error: any) {
      console.error(error);
      setNameMsg({ type: 'error', text: 'Hubo un problema al actualizar tu perfil.' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    setIsUpdatingPass(true);
    setPassMsg({ type: '', text: '' });
    
    try {
      // Re-Autenticar al usuario por seguridad
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Actualizar contraseña
      await updatePassword(user, newPassword);
      
      setPassMsg({ type: 'success', text: 'Contraseña actualizada con éxito.' });
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPassMsg({ type: '', text: '' }), 4000);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setPassMsg({ type: 'error', text: 'La contraseña actual es incorrecta.' });
      } else if (error.code === 'auth/weak-password') {
        setPassMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      } else {
        setPassMsg({ type: 'error', text: 'Error al cambiar la contraseña. Inténtalo más tarde.' });
      }
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          {isAdmin ? <Settings className="text-yellow-500" /> : <User className="text-yellow-500" />}
          {isAdmin ? 'Configuración de la Cuenta' : 'Mi Perfil'}
        </h1>
        <p className="text-gray-400">
          Gestiona tu información personal y la seguridad de tu acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- TARJETA 1: Información Personal --- */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl h-fit">
          <div className="p-6 border-b border-white/5 bg-zinc-950/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="text-yellow-500" size={20} />
              Información Personal
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateName} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Correo Electrónico (No modificable)</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nombre de Visualización</label>
                <input 
                  type="text" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              {nameMsg.text && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  nameMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {nameMsg.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                  {nameMsg.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isUpdatingName || nombre === user?.displayName}
                className="w-full px-4 py-3 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {isUpdatingName ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isUpdatingName ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>

        {/* --- TARJETA 2: Seguridad --- */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl h-fit">
          <div className="p-6 border-b border-white/5 bg-zinc-950/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="text-yellow-500" size={20} />
              Seguridad y Contraseña
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Contraseña Actual *</label>
                <input 
                  type="password" 
                  required
                  placeholder="********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nueva Contraseña *</label>
                <input 
                  type="password" 
                  required
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              {passMsg.text && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  passMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {passMsg.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                  {passMsg.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isUpdatingPass || !currentPassword || !newPassword}
                className="w-full px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isUpdatingPass ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                {isUpdatingPass ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
