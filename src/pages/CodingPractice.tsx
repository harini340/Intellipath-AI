import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Editor from '@monaco-editor/react';
import { 
  Brain, 
  Play, 
  Send, 
  ChevronLeft, 
  Code, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Zap,
  Loader2,
  Trophy,
  Sparkles
} from 'lucide-react';
import { getCodeFeedback } from '../services/codeService';

const MOCK_PROBLEM = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `
    Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
    
    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    
    You can return the answer in any order.
    
    **Example 1:**
    \`\`\`
    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
    \`\`\`
  `,
  initial_code: `function twoSum(nums, target) {\n  // Write your code here\n  \n}`,
  test_cases: [
    { input: "[2,7,11,15], 9", expected: "[0,1]" },
    { input: "[3,2,4], 6", expected: "[1,2]" }
  ]
};

export default function CodingPractice() {
  const [code, setCode] = useState(MOCK_PROBLEM.initial_code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'feedback'>('description');

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running test cases...');
    
    // Simulate execution
    setTimeout(() => {
      setOutput('Test Case 1: Passed\nTest Case 2: Passed\n\nAll tests passed successfully!');
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab('feedback');
    try {
      const aiFeedback = await getCodeFeedback(MOCK_PROBLEM.description, code, 'javascript');
      setFeedback(aiFeedback);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="font-bold hidden md:block">Problem: {MOCK_PROBLEM.title}</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded border border-emerald-500/20">
            {MOCK_PROBLEM.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Description & Feedback */}
        <div className="w-full lg:w-1/3 border-r border-white/5 flex flex-col bg-zinc-950">
          <div className="flex border-b border-white/5">
            <button 
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'description' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-zinc-500'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'feedback' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-zinc-500'}`}
            >
              AI Feedback
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' ? (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-bold mb-4">{MOCK_PROBLEM.title}</h2>
                <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {MOCK_PROBLEM.description}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!feedback && !isSubmitting && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500">Submit your code to get AI-powered feedback and suggestions.</p>
                  </div>
                )}

                {isSubmitting && (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-emerald-500 font-bold">AI is reviewing your code...</p>
                  </div>
                )}

                {feedback && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-emerald-500">AI Score</h3>
                        <span className="text-2xl font-black text-emerald-500">{feedback.score}/100</span>
                      </div>
                      <p className="text-sm text-zinc-300 italic">"{feedback.feedback}"</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Suggestions</h4>
                      {feedback.suggestions.map((s: string, i: number) => (
                        <div key={i} className="flex gap-3 p-3 bg-zinc-900 rounded-xl border border-white/5 text-sm">
                          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Time Complexity</span>
                        <span className="font-mono text-emerald-500">{feedback.complexity.time}</span>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Space Complexity</span>
                        <span className="font-mono text-emerald-500">{feedback.complexity.space}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-zinc-950">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: false,
                padding: { top: 20 }
              }}
            />
          </div>
          
          {/* Output Panel */}
          <div className="h-1/3 border-t border-white/5 bg-zinc-950 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Console Output</h3>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-xl p-4 font-mono text-sm text-zinc-400 overflow-y-auto whitespace-pre-wrap">
              {output || 'Run your code to see the output here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
