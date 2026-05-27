import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/dashboard/Overview';

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
              {/* Aquí añadiremos las otras rutas más adelante */}
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}