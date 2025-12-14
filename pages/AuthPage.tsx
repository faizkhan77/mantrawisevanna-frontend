import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '../components/UIComponents';

interface AuthPageProps {
  mode: 'LOGIN' | 'REGISTER';
  onSuccess: () => void;
  onSwitchMode: (mode: 'LOGIN' | 'REGISTER') => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onSuccess, onSwitchMode, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

// Inside AuthPage.tsx

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call validation (or real one later)
    setTimeout(() => {
      // SAVE THE ADMIN TOKEN TO LOCAL STORAGE
      // In a real app, you'd get this from a login API response
      localStorage.setItem('vanna_auth_token', 'secret-admin-key-123');
      
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md relative z-10"
      >
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <Card className="border-t border-slate-700 shadow-2xl bg-slate-900/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 mt-2">
              {mode === 'LOGIN' 
                ? 'Enter your credentials to access the SQL Bot' 
                : 'Get started with AI-powered database analysis'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-lg mt-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400"
              isLoading={isLoading}
            >
              {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => onSwitchMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                {mode === 'LOGIN' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;