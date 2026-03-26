/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Tutorial } from './pages/Tutorial';
import { References } from './pages/References';
import { Exercises } from './pages/Exercises';
import { Certificates } from './pages/Certificates';
import { cn } from './lib/utils';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { themeColor } = useSettings();
  return (
    <div className={cn("min-h-screen text-zinc-100 font-sans transition-colors duration-300", themeColor)}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ThemeWrapper>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<Layout />}>
                <Route path="/tutorial/:categoryId/:sectionId" element={<Tutorial />} />
                <Route path="/references" element={<References />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/certificates" element={<Certificates />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeWrapper>
      </AuthProvider>
    </SettingsProvider>
  );
}
