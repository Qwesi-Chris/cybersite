import React, { createContext, useContext, useState, useEffect } from 'react';

type LayoutPreference = 'default' | 'compact' | 'minimal';

interface SettingsContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
  layoutPref: LayoutPreference;
  setLayoutPref: (layout: LayoutPreference) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<string>(() => {
    return localStorage.getItem('app-theme-color') || 'bg-zinc-950';
  });
  
  const [layoutPref, setLayoutPref] = useState<LayoutPreference>(() => {
    return (localStorage.getItem('app-layout-pref') as LayoutPreference) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('app-theme-color', themeColor);
    // Apply the theme color to the body so it covers the whole screen
    document.body.className = `${themeColor} text-zinc-300 font-sans transition-colors duration-500`;
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('app-layout-pref', layoutPref);
  }, [layoutPref]);

  return (
    <SettingsContext.Provider value={{ themeColor, setThemeColor, layoutPref, setLayoutPref }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
