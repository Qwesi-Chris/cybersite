import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Terminal, Flag, Crosshair, AlertTriangle, 
  Search, Filter, Play, CheckCircle2, Clock, 
  Shield, Database, Network, Code, Lock, 
  ChevronRight, Award, Zap, BookOpen, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type Category = 'Web Security' | 'Network' | 'Cryptography' | 'Forensics' | 'Reverse Engineering';
type Status = 'available' | 'in-progress' | 'completed' | 'locked';

interface Exercise {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  timeEstimate: string;
  icon: React.ReactNode;
  description: string;
  status: Status;
  progress?: number;
  tags: string[];
}

const initialExercises: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Basic Network Scanning',
    category: 'Network',
    difficulty: 'Beginner',
    points: 50,
    timeEstimate: '30 mins',
    icon: <Network className="w-6 h-6 text-blue-500" />,
    description: 'Use Nmap to discover open ports and fingerprint services on a simulated target machine. Learn the basics of reconnaissance.',
    status: 'available',
    tags: ['Nmap', 'Reconnaissance', 'Ports']
  },
  {
    id: 'ex-2',
    title: 'SQL Injection Login Bypass',
    category: 'Web Security',
    difficulty: 'Beginner',
    points: 100,
    timeEstimate: '45 mins',
    icon: <Database className="w-6 h-6 text-emerald-500" />,
    description: 'Bypass the authentication of a mock web application using classic SQL injection techniques. Understand how improper input validation leads to unauthorized access.',
    status: 'available',
    tags: ['SQLi', 'Auth Bypass', 'Web']
  },
  {
    id: 'ex-3',
    title: 'Cross-Site Scripting (XSS) Payload',
    category: 'Web Security',
    difficulty: 'Intermediate',
    points: 150,
    timeEstimate: '1 hour',
    icon: <Code className="w-6 h-6 text-yellow-500" />,
    description: 'Craft a stored XSS payload to steal an administrator session cookie and hijack their account. Explore mitigation strategies like CSP.',
    status: 'available',
    tags: ['XSS', 'Session Hijacking', 'JavaScript']
  },
  {
    id: 'ex-4',
    title: 'Buffer Overflow Fundamentals',
    category: 'Reverse Engineering',
    difficulty: 'Advanced',
    points: 300,
    timeEstimate: '2 hours',
    icon: <Terminal className="w-6 h-6 text-purple-500" />,
    description: 'Analyze a vulnerable C program, identify the buffer overflow, and write an exploit to gain a shell. Requires knowledge of x86 assembly.',
    status: 'available',
    tags: ['Buffer Overflow', 'GDB', 'Exploit Dev']
  },
  {
    id: 'ex-5',
    title: 'RSA Encryption Weaknesses',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    points: 200,
    timeEstimate: '1.5 hours',
    icon: <Lock className="w-6 h-6 text-indigo-500" />,
    description: 'Exploit poorly chosen RSA primes to factor the modulus and decrypt a secret message. Learn about common cryptographic pitfalls.',
    status: 'available',
    tags: ['RSA', 'Math', 'Decryption']
  },
  {
    id: 'ex-6',
    title: 'Capture The Flag: Root Access',
    category: 'Network',
    difficulty: 'Expert',
    points: 500,
    timeEstimate: '4 hours',
    icon: <Flag className="w-6 h-6 text-red-500" />,
    description: 'Chain multiple vulnerabilities to gain initial access, escalate privileges to root, and read the flag.txt file in a realistic corporate network simulation.',
    status: 'available',
    tags: ['PrivEsc', 'CTF', 'Full Chain']
  }
];

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system';
  content: React.ReactNode;
}

const TerminalComponent: React.FC<{ lab: Exercise, onComplete: () => void }> = ({ lab, onComplete }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory([
      { id: '1', type: 'system', content: <span className="text-emerald-500">Initializing secure connection to lab environment...</span> },
      { id: '2', type: 'system', content: <span className="text-zinc-500">[*] Loading virtual machine instance...</span> },
      { id: '3', type: 'system', content: <span className="text-zinc-500">[*] Establishing VPN tunnel...</span> },
      { id: '4', type: 'system', content: <span className="text-emerald-400 mt-2 block">Connection established.</span> },
      { id: '5', type: 'system', content: <span className="text-zinc-300 mt-4 block">Welcome to {lab.title} environment.</span> },
      { id: '6', type: 'system', content: <span className="text-zinc-300 mb-4 block">Type 'help' for a list of available commands.</span> }
    ]);
  }, [lab.title]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const newHistory = [...history, { id: Date.now().toString(), type: 'input', content: trimmedCmd }];

    const args = trimmedCmd.split(' ');
    const command = args[0].toLowerCase();

    let output: React.ReactNode = '';

    switch (command) {
      case 'help':
        output = (
          <div className="text-zinc-300">
            <p>Available commands:</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li><span className="text-emerald-400">help</span>   - Show this help message</li>
              <li><span className="text-emerald-400">ls</span>     - List directory contents</li>
              <li><span className="text-emerald-400">cat</span>    - Concatenate files and print on the standard output</li>
              <li><span className="text-emerald-400">whoami</span> - Print effective userid</li>
              <li><span className="text-emerald-400">clear</span>  - Clear the terminal screen</li>
            </ul>
          </div>
        );
        break;
      case 'ls':
        output = <div className="text-zinc-300 flex gap-4"><span>readme.txt</span><span className="text-blue-400">flag.txt</span></div>;
        break;
      case 'cat':
        if (args[1] === 'readme.txt') {
          output = <span className="text-zinc-300">Target IP is 10.10.133.7. Find the vulnerability and read the flag.txt file to complete the lab.</span>;
        } else if (args[1] === 'flag.txt') {
          output = (
            <div>
              <span className="text-emerald-400 font-bold block mb-2">CTF{'{'}h4ck3r_m0d3_4ct1v4t3d{'}'}</span>
              <span className="text-emerald-500 font-bold animate-pulse">Lab Completed Successfully!</span>
            </div>
          );
          setTimeout(() => onComplete(), 2000);
        } else if (!args[1]) {
          output = <span className="text-zinc-300">cat: missing operand</span>;
        } else {
          output = <span className="text-zinc-300">cat: {args[1]}: No such file or directory</span>;
        }
        break;
      case 'whoami':
        output = <span className="text-zinc-300">root</span>;
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        output = <span className="text-red-400">Command not found: {command}</span>;
    }

    setHistory([...newHistory, { id: (Date.now() + 1).toString(), type: 'output', content: output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="w-full md:w-2/3 bg-[#0C0C0C] p-6 font-mono text-sm overflow-y-auto relative cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
      </div>
      
      <div className="flex flex-col gap-1 pb-4">
        {history.map((line) => (
          <div key={line.id} className="w-full">
            {line.type === 'input' ? (
              <div className="flex items-center text-zinc-300">
                <span className="text-emerald-400 mr-2">root@kali:~#</span>
                <span>{line.content}</span>
              </div>
            ) : (
              <div>{line.content}</div>
            )}
          </div>
        ))}
        
        <div className="flex items-center text-zinc-300 mt-2">
          <span className="text-emerald-400 mr-2">root@kali:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-zinc-300"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export const Exercises: React.FC = () => {
  const [labs, setLabs] = useState<Exercise[]>(initialExercises);
  const [selectedLab, setSelectedLab] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories = ['All', 'Web Security', 'Network', 'Cryptography', 'Forensics', 'Reverse Engineering'];

  const filteredExercises = useMemo(() => {
    return labs.filter(ex => {
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ex.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTab = activeTab === 'all' ? true : 
                         activeTab === 'in-progress' ? ex.status === 'in-progress' : 
                         ex.status === 'completed';
                         
      const matchesCategory = selectedCategory === 'All' ? true : ex.category === selectedCategory;

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [labs, searchQuery, activeTab, selectedCategory]);

  const handleStartLab = (lab: Exercise) => {
    if (lab.status === 'available') {
      setLabs(prev => prev.map(l => 
        l.id === lab.id ? { ...l, status: 'in-progress', progress: 0 } : l
      ));
      setSelectedLab({ ...lab, status: 'in-progress', progress: 0 });
    } else {
      setSelectedLab(lab);
    }
  };

  const handleCompleteLab = (labId: string) => {
    setLabs(prev => prev.map(l => 
      l.id === labId ? { ...l, status: 'completed', progress: 100 } : l
    ));
    setSelectedLab(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 pb-24">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 mb-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Shield className="w-96 h-96 text-emerald-500" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
                <Terminal className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Training Labs</h1>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Master cybersecurity concepts through hands-on, interactive scenarios. 
              Complete labs to earn points, unlock advanced challenges, and climb the global leaderboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-5 flex-1 lg:flex-none backdrop-blur-sm">
              <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium mb-1">Total Points</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {labs.filter(l => l.status === 'completed').reduce((acc, l) => acc + l.points, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-5 flex-1 lg:flex-none backdrop-blur-sm">
              <div className="bg-blue-500/10 p-3.5 rounded-xl border border-blue-500/20">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium mb-1">Labs Completed</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {labs.filter(l => l.status === 'completed').length} <span className="text-zinc-600 text-xl font-medium">/ {labs.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        
        {/* Tabs */}
        <div className="flex bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/80 backdrop-blur-sm w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['all', 'in-progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {tab === 'all' ? 'All Labs' : tab === 'in-progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search labs, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
              className="w-full sm:w-auto appearance-none bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={exercise.id} 
                className={`group relative bg-zinc-900/40 backdrop-blur-sm border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                  exercise.status === 'locked' 
                    ? 'border-zinc-800/50 opacity-75' 
                    : 'border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] hover:-translate-y-1'
                }`}
              >
                {/* Top Accent Line */}
                <div className={`h-1 w-full ${
                  exercise.difficulty === 'Beginner' ? 'bg-blue-500' :
                  exercise.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                  exercise.difficulty === 'Advanced' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header: Icon & Difficulty */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 group-hover:border-zinc-700 transition-colors shadow-inner">
                      {exercise.icon}
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        exercise.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        exercise.difficulty === 'Advanced' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {exercise.difficulty}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50">
                        <Clock className="w-3.5 h-3.5" />
                        {exercise.timeEstimate}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-zinc-100 mb-2.5 group-hover:text-emerald-400 transition-colors">
                    {exercise.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {exercise.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {exercise.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Progress & Action */}
                  <div className="mt-auto pt-5 border-t border-zinc-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-sm font-semibold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        +{exercise.points} pts
                      </span>
                    </div>
                    
                    {exercise.status === 'completed' ? (
                      <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </div>
                    ) : exercise.status === 'in-progress' ? (
                      <div className="flex items-center gap-3 flex-1 max-w-[150px] justify-end">
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${exercise.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-emerald-500 h-full rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }} />
                          </motion.div>
                        </div>
                        <span className="text-xs font-bold text-zinc-300 w-8">{exercise.progress}%</span>
                        <button 
                          onClick={() => handleStartLab(exercise)}
                          className="p-2 bg-emerald-500 text-white hover:bg-emerald-400 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </button>
                      </div>
                    ) : exercise.status === 'locked' ? (
                      <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
                        <Lock className="w-4 h-4" />
                        Locked
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStartLab(exercise)}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-all border border-zinc-700 hover:border-zinc-600"
                      >
                        Start Lab <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-zinc-900 p-6 rounded-full mb-4 border border-zinc-800">
                <BookOpen className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-200 mb-2">No labs found</h3>
              <p className="text-zinc-500 max-w-md">
                We couldn't find any labs matching your current search and filter criteria. Try adjusting them to see more results.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('all'); setSelectedCategory('All'); }}
                className="mt-6 text-emerald-400 hover:text-emerald-300 font-medium text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lab Modal */}
      <AnimatePresence>
        {selectedLab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedLab(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    {selectedLab.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedLab.title}</h2>
                    <p className="text-xs text-zinc-400">Target IP: 10.10.133.7 • Status: Connected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLab(null)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
                {/* Instructions Panel */}
                <div className="w-full md:w-1/3 border-r border-zinc-800 bg-zinc-900/20 p-6 overflow-y-auto">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Lab Briefing</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {selectedLab.description}
                  </p>
                  
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Objectives</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-zinc-400">
                      <div className="mt-0.5 w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0" />
                      Connect to the target machine
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-400">
                      <div className="mt-0.5 w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0" />
                      Identify the vulnerability
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-400">
                      <div className="mt-0.5 w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0" />
                      Retrieve the flag
                    </li>
                  </ul>
                </div>

                {/* Terminal Panel */}
                <TerminalComponent 
                  lab={selectedLab} 
                  onComplete={() => handleCompleteLab(selectedLab.id)} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

