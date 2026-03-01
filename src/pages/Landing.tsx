import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Code, MessageSquare, Target, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-xl font-bold tracking-tight">IntelliPath-AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-full hover:bg-emerald-400 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
              AI-Powered Learning
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Master Your Future with <br /> Personalized AI Paths
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10">
              The holistic platform for students to excel in coding, aptitude, and communication. 
              Let AI analyze your skills and build your roadmap to success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-zinc-950 font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-full border border-white/10 hover:bg-zinc-800 transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full -z-10" />
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
              <div className="aspect-video rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8 p-12 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-zinc-900 rounded-lg border border-white/5 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Holistic Skill Development</h2>
            <p className="text-zinc-400">Everything you need to become a top-tier professional.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-6 h-6 text-emerald-500" />,
                title: "Coding Mastery",
                desc: "Interactive coding environment with AI feedback and real-time execution."
              },
              {
                icon: <Target className="w-6 h-6 text-emerald-500" />,
                title: "Aptitude Reasoning",
                desc: "Sharpen your logical and quantitative skills with curated practice sets."
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
                title: "Communication",
                desc: "Improve your soft skills and professional communication with AI coaching."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">How IntelliPath-AI Works</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Initial Assessment", desc: "Take a comprehensive test to evaluate your current skill levels." },
                  { step: "02", title: "AI Path Generation", desc: "Our AI analyzes your results and creates a custom roadmap." },
                  { step: "03", title: "Personalized Learning", desc: "Follow your path with curated resources and practice modules." },
                  { step: "04", title: "Track Progress", desc: "Monitor your growth with detailed analytics and AI insights." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-2xl font-bold text-emerald-500/50 font-mono">{item.step}</span>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                      <p className="text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-white/5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Personalized Roadmap Generated</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-white/5">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Next Module: Advanced Algorithms</span>
                  </div>
                  <div className="h-32 bg-zinc-900 rounded-xl border border-white/5 flex items-end p-4 gap-2">
                    {[40, 70, 45, 90, 60, 80].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-emerald-500/20 rounded-t-sm border-t border-emerald-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight">IntelliPath-AI</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 IntelliPath-AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
