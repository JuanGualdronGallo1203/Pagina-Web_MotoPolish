import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/dashboard/Overview';
import AdminClients from './pages/dashboard/AdminClients';
import AdminJobs from './pages/dashboard/AdminJobs';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import Appointments from './pages/dashboard/Appointments';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-black">
          <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/registro" element={<><Navbar /><Register /></>} />
            
            {/* Rutas Privadas del Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route 
                path="clientes" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminClients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="trabajos" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminJobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="configuracion" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="perfil" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="calendario" 
                element={<Appointments />} 
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}