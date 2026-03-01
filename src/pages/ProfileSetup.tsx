import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, GraduationCap, Target, Sliders, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    educationLevel: '',
    careerGoal: '',
    skills: {
      coding: 50,
      aptitude: 50,
      communication: 50,
    },
    learningPreference: 'visual',
    weeklyStudyTime: 10,
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: formData.fullName,
        education_level: formData.educationLevel,
        career_goal: formData.careerGoal,
        skill_assessment: formData.skills,
        learning_preference: formData.learningPreference,
        weekly_study_time: formData.weeklyStudyTime,
      });

      if (error) throw error;
      navigate('/assessment');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">IntelliPath-AI</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>
            <span className="text-zinc-500 text-sm">Step {step} of 3</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold">Educational Background</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Education Level</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Select Level</option>
                    <option value="high-school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Career Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <Sliders className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold">Self-Assessment</h2>
              </div>

              {Object.entries(formData.skills).map(([skill, value]) => (
                <div key={skill} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-400 capitalize">{skill}</label>
                    <span className="text-emerald-500 font-bold">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      skills: { ...formData.skills, [skill]: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold">Learning Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Learning Style</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Visual', 'Practical', 'Theoretical', 'Auditory'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setFormData({ ...formData, learningPreference: style.toLowerCase() })}
                        className={`p-4 rounded-xl border transition-all text-sm font-medium ${
                          formData.learningPreference === style.toLowerCase()
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-400">Weekly Study Time</label>
                    <span className="text-emerald-500 font-bold">{formData.weeklyStudyTime} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={formData.weeklyStudyTime}
                    onChange={(e) => setFormData({ ...formData, weeklyStudyTime: parseInt(e.target.value) })}
                    className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-12">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 transition-all"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-emerald-500 text-zinc-950 font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-emerald-500 text-zinc-950 font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Finish Setup'}
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
