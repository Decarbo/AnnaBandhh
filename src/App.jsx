import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import AuthSelection from './pages/AuthSelection'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import { AuthProvider, useAuth } from './state/auth'

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="font-bold text-xl">Shree Anna</Link>
            <nav className="space-x-4">
              <Link to="/" className="text-sm">Home</Link>
              <Link to="/auth" className="text-sm">Login / Sign Up</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/auth" element={<AuthSelection/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />

            <Route path="/farmer/*" element={<RequireAuth role="seller"><FarmerDashboard/></RequireAuth>} />
            <Route path="/buyer/*" element={<RequireAuth role="buyer"><BuyerDashboard/></RequireAuth>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

function RequireAuth({children, role}){
  const {user} = useAuth()
  if(!user) return <Navigate to="/auth" replace />
  if(role && user.prefRole && user.prefRole !== role){
    return <Navigate to={user.prefRole === 'seller' ? '/farmer' : '/buyer'} replace />
  }
  return children
}
