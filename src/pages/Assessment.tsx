import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Code, Target, MessageSquare, ArrowRight, CheckCircle, Timer, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { generateLearningPath } from '../services/geminiService';

const QUESTIONS = {
  coding: [
    { id: 'c1', text: 'Which data structure is best for LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1 },
    { id: 'c2', text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct: 1 },
    { id: 'c3', text: 'Which of these is NOT a primitive type in JavaScript?', options: ['String', 'Number', 'Object', 'Boolean'], correct: 2 },
  ],
  aptitude: [
    { id: 'a1', text: 'If a train travels 60km in 45 minutes, what is its speed in km/h?', options: ['80', '75', '90', '100'], correct: 0 },
    { id: 'a2', text: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correct: 1 },
    { id: 'a3', text: 'A is the father of B, but B is not the son of A. What is B to A?', options: ['Daughter', 'Nephew', 'Niece', 'Cousin'], correct: 0 },
  ],
  communication: [
    { id: 'm1', text: 'What is the most important aspect of active listening?', options: ['Interrupting to clarify', 'Maintaining eye contact', 'Thinking of your response', 'Checking your phone'], correct: 1 },
    { id: 'm2', text: 'In a professional email, which closing is most appropriate?', options: ['Cheers', 'Best regards', 'Later', 'Sent from my iPhone'], correct: 1 },
    { id: 'm3', text: 'How should you handle a disagreement in a team meeting?', options: ['Walk out', 'Argue loudly', 'Listen and express your view calmly', 'Ignore it'], correct: 2 },
  ]
};

type Category = 'coding' | 'aptitude' | 'communication';

export default function Assessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState<Category>('coding');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const handleAnswer = (optionIdx: number) => {
    const questionId = QUESTIONS[currentCategory][currentQuestionIdx].id;
    setAnswers({ ...answers, [questionId]: optionIdx });

    if (currentQuestionIdx < QUESTIONS[currentCategory].length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      const categories: Category[] = ['coding', 'aptitude', 'communication'];
      const nextCatIdx = categories.indexOf(currentCategory) + 1;
      if (nextCatIdx < categories.length) {
        setCurrentCategory(categories[nextCatIdx]);
        setCurrentQuestionIdx(0);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Get profile
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (profileError) throw profileError;
      
      // 2. Calculate scores
      const scores = { coding: 0, aptitude: 0, communication: 0 };
      Object.entries(QUESTIONS).forEach(([cat, qs]) => {
        qs.forEach(q => {
          if (answers[q.id] === q.correct) {
            scores[cat as Category] += 1;
          }
        });
      });

      // 3. Generate AI Path
      const path = await generateLearningPath({ answers, scores }, profile);

      // 4. Save to DB
      const { error: pathError } = await supabase.from('learning_paths').insert({
        user_id: user?.id,
        roadmap: path.roadmap,
        strengths: path.strengths,
        weaknesses: path.weaknesses,
        difficulty_level: path.difficulty_level,
        summary: path.summary
      });
      if (pathError) throw pathError;

      // 5. Update profile with assessment scores
      const { error: updateError } = await supabase.from('profiles').update({
        skill_assessment: {
          coding: (scores.coding / QUESTIONS.coding.length) * 100,
          aptitude: (scores.aptitude / QUESTIONS.aptitude.length) * 100,
          communication: (scores.communication / QUESTIONS.communication.length) * 100,
        }
      }).eq('id', user?.id);
      if (updateError) throw updateError;

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete assessment. Please check your connection.');
      setIsAnalyzing(false);
      setIsFinished(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-8"
        />
        <h1 className="text-2xl font-bold mb-4">Analyzing Your Skills...</h1>
        <p className="text-zinc-400 max-w-md">Our AI is processing your answers to build a personalized learning roadmap just for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Assessment Error</h1>
        <p className="text-zinc-400 max-w-md mb-8">{error}</p>
        <button 
          onClick={() => setError(null)}
          className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl border border-white/10 hover:bg-zinc-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentCategory][currentQuestionIdx];
  const totalQuestions = Object.values(QUESTIONS).reduce((acc, q) => acc + q.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Initial Assessment</h1>
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <span className={currentCategory === 'coding' ? 'text-emerald-500' : ''}>Coding</span>
                <ChevronRight className="w-3 h-3" />
                <span className={currentCategory === 'aptitude' ? 'text-emerald-500' : ''}>Aptitude</span>
                <ChevronRight className="w-3 h-3" />
                <span className={currentCategory === 'communication' ? 'text-emerald-500' : ''}>Communication</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-full border border-white/5">
            <Timer className="w-5 h-5 text-emerald-500" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-12 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-zinc-400">Overall Progress</span>
            <span className="text-emerald-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              {currentCategory === 'coding' && <Code className="w-6 h-6 text-emerald-500" />}
              {currentCategory === 'aptitude' && <Target className="w-6 h-6 text-emerald-500" />}
              {currentCategory === 'communication' && <MessageSquare className="w-6 h-6 text-emerald-500" />}
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-500/50">{currentCategory}</span>
            </div>

            <h2 className="text-2xl font-bold mb-10 leading-tight">
              {currentQuestion.text}
            </h2>

            <div className="grid gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-zinc-950 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                >
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white">{option}</span>
                  <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          Question {answeredCount + 1} of {totalQuestions}
        </div>
      </div>
    </div>
  );
}
