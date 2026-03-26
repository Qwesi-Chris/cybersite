import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Shield, Search, Menu, LogOut, User as UserIcon, Check, LayoutPanelLeft, LayoutPanelTop, Maximize, Settings, X } from 'lucide-react';
import { tutorials } from '../data/tutorials';
import { cn } from '../lib/utils';

const BACKGROUND_COLORS = [
  { class: 'bg-zinc-950', displayClass: 'bg-zinc-950', name: 'Default' },
  { class: 'bg-slate-950', displayClass: 'bg-slate-500', name: 'Slate' },
  { class: 'bg-red-950', displayClass: 'bg-red-500', name: 'Red' },
  { class: 'bg-orange-950', displayClass: 'bg-orange-500', name: 'Orange' },
  { class: 'bg-amber-950', displayClass: 'bg-amber-500', name: 'Amber' },
  { class: 'bg-green-950', displayClass: 'bg-green-500', name: 'Green' },
  { class: 'bg-emerald-950', displayClass: 'bg-emerald-500', name: 'Emerald' },
  { class: 'bg-cyan-950', displayClass: 'bg-cyan-500', name: 'Cyan' },
  { class: 'bg-blue-950', displayClass: 'bg-blue-500', name: 'Blue' },
  { class: 'bg-indigo-950', displayClass: 'bg-indigo-500', name: 'Indigo' },
  { class: 'bg-purple-950', displayClass: 'bg-purple-500', name: 'Purple' },
  { class: 'bg-rose-950', displayClass: 'bg-rose-500', name: 'Rose' }
];

export const Layout: React.FC = () => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const { themeColor, setThemeColor, layoutPref, setLayoutPref } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">CyberSec<span className="text-zinc-100">Tutorials</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/tutorial/intro/what-is-cybersecurity" className={cn("transition-colors", location.pathname.includes('/tutorial') ? "text-emerald-400" : "hover:text-emerald-400")}>Tutorials</Link>
            <Link to="/references" className={cn("transition-colors", location.pathname === '/references' ? "text-emerald-400" : "hover:text-emerald-400")}>References</Link>
            <Link to="/exercises" className={cn("transition-colors", location.pathname === '/exercises' ? "text-emerald-400" : "hover:text-emerald-400")}>Exercises</Link>
            <Link to="/certificates" className={cn("transition-colors", location.pathname === '/certificates' ? "text-emerald-400" : "hover:text-emerald-400")}>Certificates</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 bg-zinc-800/80 border border-zinc-700 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
            />
          </div>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="text-zinc-400">{user.displayName?.split(' ')[0]}</span>
              </div>
              <button 
                onClick={logOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-4 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
            >
              Sign In
            </Link>
          )}
          
          <button className="md:hidden p-2 text-zinc-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {layoutPref !== 'minimal' && (
          <aside className="hidden md:block w-64 flex-shrink-0 bg-zinc-900/50 border-r border-zinc-800 overflow-y-auto custom-scrollbar">
            <div className="py-4">
              <h2 className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tutorial Menu</h2>
              <nav className="flex flex-col">
                {tutorials.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h3 className="px-4 py-2 text-sm font-semibold text-zinc-100 bg-zinc-800/30">
                      {category.title}
                    </h3>
                    <div className="flex flex-col mt-1">
                      {category.sections.map((section) => {
                        const path = `/tutorial/${category.id}/${section.id}`;
                        const isActive = location.pathname === path;
                        
                        return (
                          <Link
                            key={section.id}
                            to={path}
                            className={cn(
                              "px-4 py-1.5 text-sm transition-colors border-l-2",
                              isActive 
                                ? "border-emerald-500 text-emerald-400 bg-zinc-800/30 font-medium" 
                                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"
                            )}
                          >
                            {section.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn("flex-1 overflow-y-auto custom-scrollbar relative", layoutPref === 'minimal' ? "max-w-5xl mx-auto w-full" : "")}>
          <Outlet />
        </main>
        
        {/* Right Sidebar (Ads/Extras) */}
        {layoutPref === 'default' && (
          <aside className="hidden xl:block w-72 flex-shrink-0 bg-zinc-900/50 border-l border-zinc-800 overflow-y-auto p-4">
            <div className="bg-zinc-800/80 rounded-lg p-4 border border-zinc-700 mb-6">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Pro Academy
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Get certified in Advanced Penetration Testing and Network Defense.
              </p>
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition-colors">
                Learn More
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-500" />
                Appearance Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Layout Settings */}
              <div>
                <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">Layout Style</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setLayoutPref('default')}
                    className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border transition-all", layoutPref === 'default' ? "bg-zinc-800 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600")}
                  >
                    <LayoutPanelLeft className="w-6 h-6" />
                    <span className="text-xs font-bold">Default</span>
                  </button>
                  <button 
                    onClick={() => setLayoutPref('compact')}
                    className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border transition-all", layoutPref === 'compact' ? "bg-zinc-800 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600")}
                  >
                    <LayoutPanelTop className="w-6 h-6" />
                    <span className="text-xs font-bold">Compact</span>
                  </button>
                  <button 
                    onClick={() => setLayoutPref('minimal')}
                    className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border transition-all", layoutPref === 'minimal' ? "bg-zinc-800 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600")}
                  >
                    <Maximize className="w-6 h-6" />
                    <span className="text-xs font-bold">Minimal</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {layoutPref === 'default' && "Shows both navigation and extra sidebars."}
                  {layoutPref === 'compact' && "Hides the right sidebar for more content space."}
                  {layoutPref === 'minimal' && "Hides all sidebars for a distraction-free experience."}
                </p>
              </div>

              {/* Theme Color Settings */}
              <div>
                <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">Theme Color</h4>
                <div className="grid grid-cols-6 gap-3">
                  {BACKGROUND_COLORS.map((color, i) => (
                    <button 
                      key={i} 
                      onClick={() => setThemeColor(color.class)}
                      title={color.name}
                      className={cn(
                        "w-full aspect-square rounded-full cursor-pointer hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white/20", 
                        color.displayClass,
                        themeColor === color.class ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110 shadow-lg" : ""
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
