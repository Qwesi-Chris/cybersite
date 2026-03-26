import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Terminal, Database } from 'lucide-react';

export const Home: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/tutorial/intro/what-is-cybersecurity" />;
  }

  return (
    <div className="min-h-screen text-zinc-300 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center mb-8">
          <Shield className="w-24 h-24 text-emerald-500" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          Master <span className="text-emerald-500">Cybersecurity</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
          The world's largest web developer site, now for ethical hackers. 
          Learn network defense, cryptography, and web exploitation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <Lock className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure Authentication</h3>
            <p className="text-zinc-400">Learn how to implement and bypass modern authentication mechanisms.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <Terminal className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Interactive Terminal</h3>
            <p className="text-zinc-400">Practice your command-line skills with our built-in interactive terminal simulator.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <Database className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Database Exploitation</h3>
            <p className="text-zinc-400">Understand SQL injection and NoSQL vulnerabilities with hands-on labs.</p>
          </div>
        </div>

        <div className="pt-12">
          <Link 
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Start Learning Now
          </Link>
          <p className="mt-4 text-sm text-zinc-500">Members only access. Sign in with Google to continue.</p>
        </div>
      </div>
    </div>
  );
};
