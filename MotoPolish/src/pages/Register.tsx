import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config'; 
import { User, Mail, Lock, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff, Phone, Hash, Globe, MapPin, Car } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telefono: '',
    edad: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nacionalidad: 'Colombiana',
    direccion: '',
    tieneVehiculos: 'No',
    cuantosVehiculos: '',
    tiposVehiculos: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Guardar el nombre del usuario
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // 3. Crear el documento extendido en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        role: 'client',
        fechaCreacion: serverTimestamp(),
        nombre: formData.name,
        email: formData.email,
        telefono: formData.telefono,
        edad: formData.edad,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        nacionalidad: formData.nacionalidad,
        direccion: formData.direccion,
        tieneVehiculos: formData.tieneVehiculos,
        cuantosVehiculos: formData.tieneVehiculos === 'Si' ? formData.cuantosVehiculos : '0',
        tiposVehiculos: formData.tieneVehiculos === 'Si' ? formData.tiposVehiculos : 'N/A'
      });

      console.log("Usuario creado con éxito");
      navigate('/'); 
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(`Error: ${err.message || 'Desconocido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 relative">
      <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-yellow-500 transition-colors flex items-center gap-2">
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      <div className="max-w-3xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta Completa</h2>
            <p className="text-gray-400">Por favor, diligencia todos tus datos para darte el mejor servicio en MotoPolish.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm font-medium justify-center">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* DATOS DE ACCESO */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5">
              <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
                <Lock size={14} /> Datos de Acceso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input 
                      type="email" required placeholder="juan@ejemplo.com"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} required placeholder="Mínimo 6 caracteres"
                      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-12 text-white focus:outline-none focus:border-yellow-500"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-yellow-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DATOS PERSONALES */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5">
              <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
                <User size={14} /> Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input type="text" required placeholder="Ej: Juan Pérez" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Edad *</label>
                    <input type="number" required placeholder="Ej: 30" value={formData.edad} onChange={(e) => setFormData({...formData, edad: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500" />
                  </div>
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                      <input type="tel" required placeholder="Celular" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipo *</label>
                    <select value={formData.tipoDocumento} onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-yellow-500">
                      <option value="CC">CC</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">Pasap.</option>
                      <option value="NIT">NIT</option>
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nº Documento *</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-gray-500" size={18} />
                      <input type="text" required placeholder="Documento" value={formData.numeroDocumento} onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nacionalidad *</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input type="text" required placeholder="Ej: Colombiana" value={formData.nacionalidad} onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Dirección de Residencia *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input type="text" required placeholder="Ej: Calle 123 #45-67, Bogotá" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* DATOS DE VEHÍCULOS */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5">
              <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
                <Car size={14} /> Datos de Vehículos
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">¿Tienes vehículos propios? *</label>
                  <select value={formData.tieneVehiculos} onChange={(e) => setFormData({...formData, tieneVehiculos: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500">
                    <option value="Si">Sí, tengo vehículos</option>
                    <option value="No">No, no tengo vehículos</option>
                  </select>
                </div>

                {formData.tieneVehiculos === 'Si' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">¿Cuántos? *</label>
                      <input type="number" min="1" required placeholder="Ej: 2" value={formData.cuantosVehiculos} onChange={(e) => setFormData({...formData, cuantosVehiculos: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">¿Qué tipo de vehículos? *</label>
                      <input type="text" required placeholder="Ej: Moto, Carro SUV" value={formData.tiposVehiculos} onChange={(e) => setFormData({...formData, tiposVehiculos: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BOTÓN REGISTRO */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Completar Registro"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-bold transition-colors">
              Inicia Sesión aquí
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}