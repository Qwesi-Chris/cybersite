import React from 'react';
import { Terminal, Flag, Crosshair, AlertTriangle } from 'lucide-react';

export const Exercises: React.FC = () => {
  const exercises = [
    {
      id: 'ex-1',
      title: 'Basic Network Scanning',
      difficulty: 'Beginner',
      points: 50,
      icon: <Terminal className="w-6 h-6 text-blue-500" />,
      description: 'Use Nmap to discover open ports on a simulated target machine.',
      status: 'available'
    },
    {
      id: 'ex-2',
      title: 'SQL Injection Login Bypass',
      difficulty: 'Intermediate',
      points: 100,
      icon: <Crosshair className="w-6 h-6 text-orange-500" />,
      description: 'Bypass the authentication of a mock web application using SQL injection techniques.',
      status: 'available'
    },
    {
      id: 'ex-3',
      title: 'Cross-Site Scripting (XSS) Payload',
      difficulty: 'Intermediate',
      points: 150,
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      description: 'Craft a stored XSS payload to steal an administrator cookie.',
      status: 'locked'
    },
    {
      id: 'ex-4',
      title: 'Capture The Flag: Root Access',
      difficulty: 'Advanced',
      points: 500,
      icon: <Flag className="w-6 h-6 text-red-500" />,
      description: 'Chain multiple vulnerabilities to gain root access to the target server and read the flag.txt file.',
      status: 'locked'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Terminal className="w-8 h-8 text-emerald-500" />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Exercises & Labs</h1>
      </div>
      
      <p className="text-zinc-400 text-lg mb-8">
        Put your knowledge to the test with these interactive cybersecurity exercises. Earn points and unlock advanced challenges.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className={`bg-zinc-900 border rounded-xl p-6 transition-all ${
              exercise.status === 'locked' 
                ? 'border-zinc-800 opacity-60' 
                : 'border-zinc-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-zinc-800 p-3 rounded-lg">
                {exercise.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  exercise.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-400' :
                  exercise.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {exercise.difficulty}
                </span>
                <span className="text-emerald-400 font-mono text-sm mt-2">+{exercise.points} pts</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{exercise.title}</h3>
            <p className="text-zinc-400 text-sm mb-6 h-10">{exercise.description}</p>
            
            <button 
              disabled={exercise.status === 'locked'}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                exercise.status === 'locked'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {exercise.status === 'locked' ? 'Locked' : 'Start Lab'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
