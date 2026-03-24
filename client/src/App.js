import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyPlan from './pages/MyPlan';
import Tours, { Gallery, GroupTravel, Blogs, About, Contact } from './pages/Tours';
import Chat from './pages/Chat';
import BudgetTracker from './pages/BudgetTracker';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg)' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { user } = useAuth();
  useEffect(() => {
    const theme = localStorage.getItem('navig_theme') || user?.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/group-travel" element={<GroupTravel />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/budget" element={<BudgetTracker />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </AuthProvider>
);

export default App;
