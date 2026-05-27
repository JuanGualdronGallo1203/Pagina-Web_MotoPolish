import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  // Si está cargando el estado de autenticación, mostramos un spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  // Si no hay usuario autenticado, redirige a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene el rol permitido, redirige al dashboard (o home)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si pasa las validaciones, renderiza el componente
  return <>{children}</>;
}
