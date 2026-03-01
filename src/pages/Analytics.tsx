import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Code, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  Trophy,
  History,
  Radar,
  AlertCircle
} from 'lucide-react';
import { 
  Radar as RadarChart, 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Analytics() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
        if (profileError) throw profileError;

        const { data: pathData, error: pathError } = await supabase.from('learning_paths').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(1).single();
        
        setProfile(profileData);
        setLearningPath(pathData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data. Please check your connection.');
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

  const radarData = [
    { subject: 'Coding', A: profile?.skill_assessment?.coding || 0, fullMark: 100 },
    { subject: 'Aptitude', A: profile?.skill_assessment?.aptitude || 0, fullMark: 100 },
    { subject: 'Comm.', A: profile?.skill_assessment?.communication || 0, fullMark: 100 },
    { subject: 'Logic', A: 75, fullMark: 100 },
    { subject: 'Soft Skills', A: 60, fullMark: 100 },
    { subject: 'Problem Solving', A: 85, fullMark: 100 },
  ];

  const trendData = [
    { name: 'Week 1', score: 45 },
    { name: 'Week 2', score: 52 },
    { name: 'Week 3', score: 48 },
    { name: 'Week 4', score: 61 },
    { name: 'Week 5', score: 68 },
    { name: 'Week 6', score: 75 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-all border border-white/5">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Progress Analytics</h1>
              <p className="text-zinc-500 mt-1">Detailed insights into your skill development journey.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">AI Insights Updated</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Radar */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Radar className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-xl">Skill Radar</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <RadarChart
                    name="Skills"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </RechartsRadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-white/5">
                <span className="text-sm text-zinc-400">Top Skill</span>
                <span className="text-sm font-bold text-emerald-500">Problem Solving (85%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-white/5">
                <span className="text-sm text-zinc-400">Growth Area</span>
                <span className="text-sm font-bold text-amber-500">Soft Skills (60%)</span>
              </div>
            </div>
          </div>

          {/* Improvement Trends */}
          <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-xl">Improvement Trends</h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Modules Completed</span>
                <span className="text-2xl font-bold">24</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Study Hours</span>
                <span className="text-2xl font-bold">156</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Global Rank</span>
                <span className="text-2xl font-bold">#1,245</span>
              </div>
            </div>
          </div>

          {/* AI Improvement Suggestions */}
          <div className="lg:col-span-3 bg-zinc-900 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-xl">AI Improvement Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code className="w-5 h-5 text-emerald-500" />,
                  title: "Focus on Algorithms",
                  desc: "Your coding logic is strong, but you can improve time complexity awareness. Try practicing more Dynamic Programming problems.",
                  action: "Start DP Module"
                },
                {
                  icon: <Target className="w-5 h-5 text-blue-500" />,
                  title: "Speed up Reasoning",
                  desc: "You're accurate in aptitude but take longer than average. Practice with timed mock tests to improve your speed.",
                  action: "Take Mock Test"
                },
                {
                  icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
                  title: "Professional Tone",
                  desc: "Your communication is clear. To reach the next level, focus on using more professional vocabulary in business contexts.",
                  action: "Business Comm. Path"
                }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-zinc-950 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-zinc-400 mb-6 flex-1">{item.desc}</p>
                  <button className="w-full py-2 bg-zinc-900 text-white text-sm font-bold rounded-lg border border-white/5 hover:bg-zinc-800 transition-all">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
