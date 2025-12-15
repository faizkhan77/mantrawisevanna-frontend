import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { ViewState, ColorPalette } from './types';
import { checkSession, logoutUser } from './services/api';
import { Loader2 } from 'lucide-react';

// Color definitions matching Tailwind scales
const PALETTES: Record<ColorPalette, Record<string, string>> = {
  blue: {
    50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
    500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49'
  },
  violet: {
    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
    500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065'
  },
  emerald: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
    500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22'
  },
  rose: {
    50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
    500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519'
  },
  amber: {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
    500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03'
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePalette, setActivePalette] = useState<ColorPalette>('blue');
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize theme class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Inject color variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = PALETTES[activePalette];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value);
    });
  }, [activePalette]);

  // Check Session on Mount
  useEffect(() => {
    const init = async () => {
      const isAuthenticated = await checkSession();
      if (isAuthenticated) {
        setCurrentView(ViewState.DASHBOARD);
      }
      setIsInitializing(false);
    };
    init();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView(ViewState.LANDING);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return (
          <LandingPage 
            onLogin={() => setCurrentView(ViewState.LOGIN)} 
            onRegister={() => setCurrentView(ViewState.REGISTER)}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            activePalette={activePalette}
            setPalette={setActivePalette}
          />
        );
      case ViewState.LOGIN:
        return (
          <AuthPage 
            mode="LOGIN"
            onSuccess={() => setCurrentView(ViewState.DASHBOARD)}
            onSwitchMode={() => setCurrentView(ViewState.REGISTER)}
            onBack={() => setCurrentView(ViewState.LANDING)}
          />
        );
      case ViewState.REGISTER:
        return (
          <AuthPage 
            mode="REGISTER"
            onSuccess={() => setCurrentView(ViewState.DASHBOARD)}
            onSwitchMode={() => setCurrentView(ViewState.LOGIN)}
            onBack={() => setCurrentView(ViewState.LANDING)}
          />
        );
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default App;