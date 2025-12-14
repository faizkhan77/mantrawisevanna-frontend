import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Database, Bot, Sparkles, ArrowRight, BarChart3, Lock, Zap, 
  Menu, X, Moon, Sun, CheckCircle, ChevronDown, Github, Twitter, Linkedin
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';
import { Button, Card, Badge } from '../components/UIComponents';
import { ColorPalette } from '../types';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  activePalette: ColorPalette;
  setPalette: (p: ColorPalette) => void;
}

// Mock Data for Demo Chart
const demoData = [
  { name: 'Mon', bookings: 40, revenue: 2400 },
  { name: 'Tue', bookings: 30, revenue: 1398 },
  { name: 'Wed', bookings: 20, revenue: 9800 },
  { name: 'Thu', bookings: 27, revenue: 3908 },
  { name: 'Fri', bookings: 18, revenue: 4800 },
  { name: 'Sat', bookings: 23, revenue: 3800 },
  { name: 'Sun', bookings: 34, revenue: 4300 },
];

const LandingPage: React.FC<LandingPageProps> = ({ 
  onLogin, 
  onRegister,
  isDarkMode,
  toggleTheme,
  activePalette,
  setPalette
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const PaletteDot = ({ color, palette }: { color: string, palette: ColorPalette }) => (
    <button
      onClick={() => setPalette(palette)}
      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${activePalette === palette ? 'border-white ring-2 ring-primary-400' : 'border-transparent'}`}
      style={{ backgroundColor: color }}
      title={palette}
    />
  );

  return (
    <div className={`min-h-screen relative font-sans selection:bg-primary-500/30 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Navbar */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? isDarkMode ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800' : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">mantrawise</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo('features')} className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors">How it Works</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors">Pricing</button>
            
            <div className="h-6 w-px bg-slate-500/20" />
            
            {/* Theme & Color Controls */}
            <div className="flex items-center space-x-3">
               <PaletteDot color="#0ea5e9" palette="blue" />
               <PaletteDot color="#8b5cf6" palette="violet" />
               <PaletteDot color="#10b981" palette="emerald" />
               <PaletteDot color="#f43f5e" palette="rose" />
               <PaletteDot color="#f59e0b" palette="amber" />
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Button onClick={onLogin} variant="ghost" className="!px-4">Log In</Button>
            <Button onClick={onRegister} className="rounded-full !px-6 !py-2">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`md:hidden overflow-hidden border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
               <div className="flex flex-col p-6 space-y-4">
                  <button onClick={() => scrollTo('features')} className="text-left py-2">Features</button>
                  <button onClick={() => scrollTo('how-it-works')} className="text-left py-2">How it Works</button>
                  <button onClick={() => scrollTo('pricing')} className="text-left py-2">Pricing</button>
                  <div className="flex items-center space-x-4 py-4 border-t border-slate-700/50">
                     <span className="text-sm opacity-50">Theme</span>
                     <button onClick={toggleTheme}>{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                     <span className="text-sm opacity-50">Color</span>
                     <PaletteDot color="#0ea5e9" palette="blue" />
                     <PaletteDot color="#8b5cf6" palette="violet" />
                     <PaletteDot color="#10b981" palette="emerald" />
                  </div>
                  <div className="flex flex-col space-y-3 mt-4">
                    <Button onClick={onLogin} variant="secondary" className="w-full">Log In</Button>
                    <Button onClick={onRegister} className="w-full">Get Started</Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div 
               animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 10, repeat: Infinity }}
               className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px]" 
            />
            <motion.div 
               animate={{ y: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 15, repeat: Infinity, delay: 1 }}
               className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" 
            />
         </div>

         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div style={{ y: heroY }} className="relative z-10">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 mb-8 border backdrop-blur-sm ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-white/50 border-slate-200 text-slate-600'
                  }`}
               >
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium">Powered by Vanna AI 2.0</span>
               </motion.div>
               
               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6"
               >
                  Talk to your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Database</span>
               </motion.h1>
               
               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`text-xl mb-10 max-w-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
               >
                  Transform complex SQL queries into natural language. Instant visual insights for hospitality, finance, and logistics data.
               </motion.p>
               
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
               >
                  <Button onClick={onRegister} className="text-lg px-8 py-4 rounded-full group shadow-xl shadow-primary-500/20">
                     Start Querying Free
                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button onClick={() => scrollTo('demo')} variant="outline" className="text-lg px-8 py-4 rounded-full border-2">
                     Live Demo
                  </Button>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 flex items-center space-x-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
               >
                  {/* Simulated Trust Badges */}
                  <div className="font-display font-bold text-xl">ACME Corp</div>
                  <div className="font-display font-bold text-xl">Globex</div>
                  <div className="font-display font-bold text-xl">Soylent</div>
               </motion.div>
            </motion.div>

            {/* 3D/Abstract Visual */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
               animate={{ opacity: 1, scale: 1, rotateY: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="relative lg:h-[600px] flex items-center justify-center perspective-1000"
            >
               <div className="relative w-full max-w-md">
                  {/* Floating Elements */}
                  <motion.div 
                     animate={{ y: [0, -15, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className={`relative z-20 rounded-2xl p-6 shadow-2xl border ${
                        isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-100'
                     }`}
                  >
                     <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                           <Bot className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                           <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Assistant</div>
                           <div className="text-xs text-primary-500">Processing Query...</div>
                        </div>
                     </div>
                     <div className={`p-4 rounded-lg mb-4 text-sm font-mono ${isDarkMode ? 'bg-slate-950 text-blue-300' : 'bg-slate-50 text-blue-600'}`}>
                        SELECT * FROM bookings WHERE revenue &gt; 5000;
                     </div>
                     <div className="h-40 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={demoData}>
                              <defs>
                                 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="revenue" stroke="var(--primary-500)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute top-10 -right-10 w-24 h-24 bg-purple-500 rounded-2xl rotate-12 opacity-20 blur-xl animate-pulse-slow" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-500 rounded-full opacity-20 blur-xl" />
               </div>
            </motion.div>
         </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className={`py-24 relative ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'}`}>
         <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
               <Badge>Live Preview</Badge>
               <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-4">See it in Action</h2>
               <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Experience how Mantrawise translates natural language into actionable data visualization instantly.
               </p>
            </div>

            <div className={`rounded-3xl border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
               <div className="grid lg:grid-cols-12 min-h-[500px]">
                  {/* Chat Side */}
                  <div className={`lg:col-span-4 p-6 border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                     <div className="space-y-4">
                        <div className="flex justify-end">
                           <div className="bg-primary-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm max-w-[90%]">
                              Show me revenue trends for the last week by day.
                           </div>
                        </div>
                        <div className="flex justify-start">
                           <div className={`px-4 py-2 rounded-2xl rounded-tl-none text-sm max-w-[90%] ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white shadow-sm border border-slate-100 text-slate-700'}`}>
                              <p className="mb-2">I found 7 records matching your query.</p>
                              <div className="text-xs font-mono opacity-70 mb-2">
                                 SELECT date, SUM(amount) as revenue FROM daily_sales GROUP BY date LIMIT 7;
                              </div>
                              <span className="text-xs text-primary-500 font-medium">Generating Chart...</span>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8">
                        <input 
                           disabled
                           placeholder="Ask a question about your data..." 
                           className={`w-full px-4 py-3 rounded-xl text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 border'} cursor-not-allowed opacity-70`}
                        />
                     </div>
                  </div>

                  {/* Visualization Side */}
                  <div className="lg:col-span-8 p-8 flex flex-col justify-center bg-opacity-50">
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={demoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                 <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <XAxis dataKey="name" stroke={isDarkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                              <RechartsTooltip 
                                 contentStyle={{ 
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                                    borderRadius: '8px',
                                    color: isDarkMode ? '#fff' : '#0f172a'
                                 }}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="var(--primary-500)" fillOpacity={1} fill="url(#colorRev2)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="mt-4 flex justify-center space-x-6 text-sm text-slate-500">
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-primary-500 mr-2" /> Revenue</div>
                        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-300 mr-2" /> Bookings</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">From Question to Insight</h2>
               <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Our engine handles the complexity of database schemas so you don't have to.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                  {
                     step: "01",
                     title: "Connect Data",
                     desc: "Securely connect your SQL database or upload CSV/Excel files directly.",
                     icon: <Database className="w-8 h-8 text-primary-500" />
                  },
                  {
                     step: "02",
                     title: "Ask Naturally",
                     desc: "Type questions in plain English. No SQL knowledge required.",
                     icon: <MessageBubbleIcon />
                  },
                  {
                     step: "03",
                     title: "Get Insights",
                     desc: "Receive accurate SQL queries, data tables, and auto-generated charts.",
                     icon: <BarChart3 className="w-8 h-8 text-primary-500" />
                  }
               ].map((item, i) => (
                  <motion.div 
                     key={i}
                     whileHover={{ y: -10 }}
                     className={`relative p-8 rounded-2xl border transition-all duration-300 group ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-primary-500/50' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-primary-200'
                     }`}
                  >
                     <div className="absolute top-6 right-8 text-6xl font-display font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                        {item.step}
                     </div>
                     <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                        isDarkMode ? 'bg-slate-800 group-hover:bg-primary-500/20' : 'bg-primary-50 group-hover:bg-primary-100'
                     }`}>
                        {item.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                     <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={`py-24 ${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Enterprise-Grade <br/> SQL Intelligence</h2>
                  <div className="space-y-6">
                     {[
                        "Fine-tuned on your specific database schema",
                        "Self-correction capabilities for ambiguous queries",
                        "Enterprise security with role-based access",
                        "Export to CSV, PDF, or Python Notebooks"
                     ].map((feat, i) => (
                        <div key={i} className="flex items-start space-x-3">
                           <CheckCircle className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                           <span className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{feat}</span>
                        </div>
                     ))}
                  </div>
                  <Button onClick={onRegister} className="mt-10 rounded-full" variant="secondary">Explore Features</Button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'} translate-y-8`}>
                     <Lock className="w-8 h-8 text-primary-500 mb-4" />
                     <h4 className="font-bold mb-2">Secure</h4>
                     <p className="text-sm opacity-70">Read-only access to your data. We never store your records.</p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'}`}>
                     <Zap className="w-8 h-8 text-amber-500 mb-4" />
                     <h4 className="font-bold mb-2">Fast</h4>
                     <p className="text-sm opacity-70">Optimized Vanna.AI models return queries in milliseconds.</p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'} translate-y-8`}>
                     <Database className="w-8 h-8 text-purple-500 mb-4" />
                     <h4 className="font-bold mb-2">Agnostic</h4>
                     <p className="text-sm opacity-70">Works with Postgres, Snowflake, BigQuery, and SQL Server.</p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'}`}>
                     <BarChart3 className="w-8 h-8 text-green-500 mb-4" />
                     <h4 className="font-bold mb-2">Visual</h4>
                     <p className="text-sm opacity-70">Auto-generated Plotly and Recharts visualizations.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Simple Pricing</h2>
               <p className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Start free, scale as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                  { name: "Starter", price: "$0", features: ["50 Queries/mo", "1 Database", "Basic Charts", "Community Support"] },
                  { name: "Pro", price: "$49", features: ["Unlimited Queries", "5 Databases", "Advanced Analytics", "Priority Support", "CSV Export"], featured: true },
                  { name: "Enterprise", price: "Custom", features: ["On-Premise Deployment", "Custom Model Training", "SSO & Audit Logs", "Dedicated Account Manager"] }
               ].map((plan, i) => (
                  <motion.div 
                     key={i}
                     whileHover={{ y: -8 }}
                     className={`relative p-8 rounded-2xl border flex flex-col ${
                        plan.featured 
                           ? `border-primary-500 ring-1 ring-primary-500/50 ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-2xl shadow-primary-500/10'}` 
                           : `${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`
                     }`}
                  >
                     {plan.featured && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                           Most Popular
                        </div>
                     )}
                     <div className="mb-8">
                        <h3 className="text-lg font-medium opacity-70 mb-2">{plan.name}</h3>
                        <div className="text-4xl font-display font-bold">{plan.price}<span className="text-lg opacity-50 font-sans font-normal">/mo</span></div>
                     </div>
                     <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((f, idx) => (
                           <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-primary-500 mr-3 shrink-0" />
                              <span className="opacity-80">{f}</span>
                           </li>
                        ))}
                     </ul>
                     <Button 
                        variant={plan.featured ? 'primary' : 'outline'} 
                        className="w-full justify-center"
                        onClick={onRegister}
                     >
                        Choose {plan.name}
                     </Button>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
               {[
                  { q: "Is my database data secure?", a: "Absolutely. Mantrawise only requires read-only access to your schema. We query your data in real-time and never store the actual rows on our servers." },
                  { q: "Which databases do you support?", a: "We support PostgreSQL, MySQL, Snowden, BigQuery, and SQL Server out of the box. Custom integrations are available for Enterprise plans." },
                  { q: "Do I need to know SQL?", a: "Not at all! The platform is designed for non-technical users to ask questions in plain English and get answers immediately." }
               ].map((faq, i) => (
                  <div key={i} className={`rounded-xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                     <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                     <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
               <div className="col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                     <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Bot className="text-white w-5 h-5" />
                     </div>
                     <span className="font-display font-bold text-xl">mantrawise</span>
                  </div>
                  <p className={`max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                     Empowering hospitality businesses with AI-driven data insights.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm opacity-70">
                     <li><button onClick={() => scrollTo('features')} className="hover:text-primary-500">Features</button></li>
                     <li><button onClick={() => scrollTo('pricing')} className="hover:text-primary-500">Pricing</button></li>
                     <li><a href="#" className="hover:text-primary-500">API Documentation</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm opacity-70">
                     <li><a href="#" className="hover:text-primary-500">About Us</a></li>
                     <li><a href="#" className="hover:text-primary-500">Blog</a></li>
                     <li><a href="#" className="hover:text-primary-500">Contact</a></li>
                  </ul>
               </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/50">
               <p className="text-sm opacity-50">© 2024 Mantrawise Inc. All rights reserved.</p>
               <div className="flex space-x-6 mt-4 md:mt-0 opacity-70">
                  <Github className="w-5 h-5 hover:text-primary-500 cursor-pointer" />
                  <Twitter className="w-5 h-5 hover:text-primary-500 cursor-pointer" />
                  <Linkedin className="w-5 h-5 hover:text-primary-500 cursor-pointer" />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

// Helper Icons
const MessageBubbleIcon = () => (
   <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
   </svg>
);

export default LandingPage;