import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Brain, 
  Code, 
  Target, 
  MessageSquare, 
  Flame, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const runTestFlow = async () => {
    if (!user) return;
    setTestStatus('Running test...');
    try {
      const result = await profileService.runTestFlow(user.id, user.user_metadata?.full_name || 'Test User');
      if (result.success) {
        setTestStatus('Test successful! Profile updated.');
        // Refresh data
        window.location.reload();
      } else {
        setTestStatus(`Test failed: ${result.error}`);
      }
    } catch (err: any) {
      setTestStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
        if (profileError) throw profileError;
        
        const { data: pathData, error: pathError } = await supabase.from('learning_paths').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(1).single();
        // pathData might be null if it's a new user, that's okay
        
        setProfile(profileData);
        setLearningPath(pathData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data. Please check your connection and Supabase configuration.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
        <p className="text-zinc-400 max-w-md mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl border border-white/10 hover:bg-zinc-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const chartData = [
    { name: 'Coding', value: profile?.skill_assessment?.coding || 0, color: '#10b981' },
    { name: 'Aptitude', value: profile?.skill_assessment?.aptitude || 0, color: '#3b82f6' },
    { name: 'Comm.', value: profile?.skill_assessment?.communication || 0, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">IntelliPath-AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/coding" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-white/5 rounded-xl transition-all">
            <Code className="w-5 h-5" />
            Coding Practice
          </Link>
          <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-white/5 rounded-xl transition-all">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
            <p className="text-zinc-500 mt-1">Here's what's happening with your learning path today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-white/5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold">12 Day Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-white/5">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">2450 XP</span>
            </div>
            <button 
              onClick={runTestFlow}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-sm font-bold rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              {testStatus || 'Test Connection'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Skill Levels</h3>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">Daily Goal</h3>
                  <p className="text-zinc-500 text-sm mb-6">Complete 2 more modules to hit your target.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Progress</span>
                    <span className="text-emerald-500">60%</span>
                  </div>
                  <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%]" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span>45 mins remaining today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Roadmap */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Your Learning Roadmap</h3>
                <Link to="/analytics" className="text-emerald-500 text-sm font-medium hover:underline">View Full Path</Link>
              </div>
              <div className="space-y-4">
                {learningPath?.roadmap?.slice(0, 3).map((step: any, i: number) => (
                  <div key={i} className="group flex items-center gap-6 p-4 bg-zinc-950 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      step.category === 'coding' ? 'bg-emerald-500/10 text-emerald-500' :
                      step.category === 'aptitude' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {step.category === 'coding' ? <Code className="w-6 h-6" /> :
                       step.category === 'aptitude' ? <Target className="w-6 h-6" /> :
                       <MessageSquare className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-50">{step.category}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-zinc-400">{step.difficulty}</span>
                      </div>
                      <h4 className="font-bold">{step.title}</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                      <ChevronRight className="w-5 h-5 group-hover:text-zinc-950" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-emerald-500 rounded-3xl p-6 text-zinc-950">
              <h3 className="font-bold text-xl mb-2">Ready to practice?</h3>
              <p className="text-zinc-950/70 text-sm mb-6">Jump back into your coding session and earn 50 XP.</p>
              <Link to="/coding" className="block w-full py-3 bg-zinc-950 text-white text-center font-bold rounded-xl hover:bg-zinc-800 transition-all">
                Start Coding
              </Link>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold mb-6">AI Insights</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 block">Strengths</span>
                  <div className="flex flex-wrap gap-2">
                    {learningPath?.strengths?.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-full border border-emerald-500/20">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 block">Focus Areas</span>
                  <div className="flex flex-wrap gap-2">
                    {learningPath?.weaknesses?.map((w: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold mb-6">Achievements</h3>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`aspect-square rounded-xl flex items-center justify-center ${i <= 2 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-zinc-950 border border-white/5 opacity-30'}`}>
                    <Trophy className={`w-5 h-5 ${i <= 2 ? 'text-emerald-500' : 'text-zinc-700'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
