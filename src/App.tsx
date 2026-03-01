import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { isSupabaseConfigured } from './lib/supabase';
import { AlertCircle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { startHealthCheck } from './services/healthCheck';

// Pages (to be created)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import CodingPractice from './pages/CodingPractice';
import Analytics from './pages/Analytics';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      const stopHealthCheck = startHealthCheck();
      return () => stopHealthCheck();
    }
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`);
      if (response.ok) {
        setTestResult({ success: true, message: 'Connection successful! Your Supabase URL is reachable.' });
      } else {
        setTestResult({ success: false, message: `Connection failed with status: ${response.status}. Please check your Supabase URL.` });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Failed to connect. Please check your internet connection and Supabase URL.' });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Please set up your Supabase environment variables in the Secrets panel to start using IntelliPath-AI.
          </p>
          <div className="space-y-3 text-left bg-zinc-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-500 mb-8">
            <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
            <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••' : 'Not set'}</p>
          </div>

          {testResult && (
            <div className={`p-4 rounded-xl mb-8 text-sm ${testResult.success ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {testResult.message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button 
              onClick={testConnection}
              disabled={isTesting}
              className="w-full py-3 bg-emerald-500 text-zinc-950 font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/profile-setup" element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          } />
          
          <Route path="/assessment" element={
            <PrivateRoute>
              <Assessment />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/coding" element={
            <PrivateRoute>
              <CodingPractice />
            </PrivateRoute>
          } />
          
          <Route path="/analytics" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
