import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTutorialSection, getNextSection, getPrevSection } from '../data/tutorials';
import { ChevronLeft, ChevronRight, Terminal as TerminalIcon, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const Tutorial: React.FC = () => {
  const { categoryId, sectionId } = useParams<{ categoryId: string; sectionId: string }>();
  const { user, loading } = useAuth();
  
  const [completed, setCompleted] = useState<boolean>(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const section = categoryId && sectionId ? getTutorialSection(categoryId, sectionId) : null;
  const nextSection = categoryId && sectionId ? getNextSection(categoryId, sectionId) : null;
  const prevSection = categoryId && sectionId ? getPrevSection(categoryId, sectionId) : null;

  useEffect(() => {
    if (user && categoryId && sectionId) {
      // Reset state on section change
      setQuizAnswer(null);
      setQuizSubmitted(false);
      setTerminalInput('');
      setTerminalOutput('');
      
      const checkCompletion = async () => {
        const path = `users/${user.uid}/progress/${categoryId}_${sectionId}`;
        try {
          const docRef = doc(db, 'users', user.uid, 'progress', `${categoryId}_${sectionId}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCompleted(docSnap.data().completed);
          } else {
            setCompleted(false);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      };
      checkCompletion();
    }
  }, [user, categoryId, sectionId]);

  const markCompleted = async () => {
    if (!user || !categoryId || !sectionId) return;
    const path = `users/${user.uid}/progress/${categoryId}_${sectionId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'progress', `${categoryId}_${sectionId}`), {
        completed: true,
        timestamp: new Date()
      }, { merge: true });
      setCompleted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (section?.interactive?.correctAnswer === quizAnswer) {
      markCompleted();
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!section?.interactive) return;

    if (terminalInput.trim() === section.interactive.command) {
      setTerminalOutput(section.interactive.expectedOutput || 'Success!');
      markCompleted();
    } else {
      setTerminalOutput(`bash: ${terminalInput}: command not found or incorrect syntax`);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!section) {
    return <div className="p-8 text-zinc-400">Tutorial not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{section.title}</h1>
        {completed && (
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </div>
        )}
      </div>

      <div className="prose prose-invert prose-emerald max-w-none mb-12">
        {section.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('### ')) {
            return <h3 key={i} className="text-2xl font-bold text-zinc-100 mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
          }
          if (paragraph.startsWith('* ')) {
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 text-zinc-300">
                {paragraph.split('\n').map((item, j) => {
                  // Handle bold text in list items
                  const parts = item.replace('* ', '').split('**');
                  return (
                    <li key={j}>
                      {parts.map((part, k) => k % 2 === 1 ? <strong key={k} className="text-zinc-100">{part}</strong> : part)}
                    </li>
                  );
                })}
              </ul>
            );
          }
          if (paragraph.startsWith('\`\`\`')) {
            const code = paragraph.replace(/\`\`\`(sql)?\n/g, '').replace(/\n\`\`\`/g, '');
            return (
              <pre key={i} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 overflow-x-auto my-4">
                <code className="text-emerald-400 font-mono text-sm">{code}</code>
              </pre>
            );
          }
          
          // Handle inline code
          const inlineParts = paragraph.split('\`');
          return (
            <p key={i} className="text-zinc-300 leading-relaxed mb-4">
              {inlineParts.map((part, k) => k % 2 === 1 ? <code key={k} className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono">{part}</code> : part)}
            </p>
          );
        })}
      </div>

      {/* Interactive Section */}
      {section.interactive && (
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            {section.interactive.type === 'terminal' ? (
              <TerminalIcon className="w-5 h-5 text-emerald-500" />
            ) : (
              <Shield className="w-5 h-5 text-emerald-500" />
            )}
            <h3 className="font-bold text-white">
              {section.interactive.type === 'terminal' ? 'Interactive Terminal' : 'Knowledge Check'}
            </h3>
          </div>
          
          <div className="p-6">
            {section.interactive.type === 'quiz' && section.interactive.options && (
              <div className="space-y-4">
                <p className="text-lg font-medium text-zinc-200">{section.interactive.question}</p>
                <div className="space-y-2">
                  {section.interactive.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                      disabled={quizSubmitted}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border transition-all",
                        quizAnswer === idx ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800",
                        quizSubmitted && idx === section.interactive?.correctAnswer && "border-emerald-500 bg-emerald-500/20 text-emerald-400",
                        quizSubmitted && quizAnswer === idx && idx !== section.interactive?.correctAnswer && "border-red-500 bg-red-500/20 text-red-400"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quizSubmitted && idx === section.interactive?.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {quizSubmitted && quizAnswer === idx && idx !== section.interactive?.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </button>
                  ))}
                </div>
                {!quizSubmitted && (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizAnswer === null}
                    className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    Submit Answer
                  </button>
                )}
                {quizSubmitted && quizAnswer === section.interactive.correctAnswer && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    Correct! You've mastered this concept.
                  </div>
                )}
              </div>
            )}

            {section.interactive.type === 'terminal' && (
              <div className="space-y-4">
                <p className="text-zinc-400 mb-4">Try executing the command discussed above:</p>
                <div className="bg-black rounded-lg p-4 font-mono text-sm border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2">root@kali:~#</span>
                  </div>
                  <form onSubmit={handleTerminalSubmit} className="flex items-center text-emerald-400">
                    <span className="mr-2">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent outline-none border-none text-emerald-400"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </form>
                  {terminalOutput && (
                    <div className="mt-4 text-zinc-300 whitespace-pre-wrap border-t border-zinc-800 pt-4">
                      {terminalOutput}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-800">
        {prevSection ? (
          <Link
            to={`/tutorial/${prevSection.categoryId}/${prevSection.sectionId}`}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Link>
        ) : (
          <div></div>
        )}
        
        {nextSection && (
          <Link
            to={`/tutorial/${nextSection.categoryId}/${nextSection.sectionId}`}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};
