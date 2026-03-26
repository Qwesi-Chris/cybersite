import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { tutorials } from '../data/tutorials';

export const Certificates: React.FC = () => {
  const { user } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalSections = tutorials.reduce((acc, cat) => acc + cat.sections.length, 0);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'progress'));
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (doc.data().completed) count++;
        });
        setCompletedCount(count);
      } catch (error) {
        console.error("Error fetching progress", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const progressPercentage = Math.round((completedCount / totalSections) * 100);
  const isCertified = completedCount === totalSections;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-emerald-500" />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Certificates</h1>
      </div>
      
      <p className="text-zinc-400 text-lg mb-12">
        Track your progress and earn your Cybersecurity Fundamentals Certificate.
      </p>

      {/* Progress Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12 shadow-xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Course Progress</h2>
            <p className="text-zinc-400">Complete all tutorials to unlock your certificate.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-emerald-500">{progressPercentage}%</span>
            <p className="text-sm text-zinc-500 font-mono mt-1">{completedCount} / {totalSections} Modules</p>
          </div>
        </div>
        
        <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden border border-zinc-700">
          <div 
            className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Certificate Display */}
      <div className="relative">
        {!isCertified && (
          <div className="absolute inset-0 z-10 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-zinc-800">
            <Lock className="w-16 h-16 text-zinc-600 mb-4" />
            <h3 className="text-2xl font-bold text-zinc-300 mb-2">Certificate Locked</h3>
            <p className="text-zinc-500 max-w-md text-center">
              You must complete 100% of the tutorial modules to unlock and download your official certificate.
            </p>
          </div>
        )}

        <div className={`bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 ${isCertified ? 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'border-zinc-800'} rounded-2xl p-12 text-center relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-br-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-tl-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Award className={`w-24 h-24 mx-auto mb-6 ${isCertified ? 'text-emerald-500' : 'text-zinc-700'}`} />
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500 mb-4">Certificate of Completion</h2>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Cybersecurity Fundamentals</h1>
            
            <p className="text-zinc-400 mb-2">This certifies that</p>
            <p className="text-2xl font-bold text-emerald-400 mb-8 border-b border-zinc-800 pb-4 inline-block min-w-[300px]">
              {user?.displayName || 'Student Name'}
            </p>
            
            <p className="text-zinc-500 max-w-lg mx-auto mb-12 leading-relaxed">
              Has successfully completed the comprehensive curriculum covering Network Security, Web Exploitation, and Defensive Strategies.
            </p>
            
            <div className="flex justify-center gap-12 text-left">
              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Date</p>
                <p className="font-mono text-zinc-400">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">ID</p>
                <p className="font-mono text-zinc-400">CYB-{user?.uid.substring(0, 8).toUpperCase() || 'XXXX'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
