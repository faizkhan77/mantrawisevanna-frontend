import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Database, 
  History, 
  BrainCircuit, 
  LogOut, 
  Moon, 
  Sun, 
  Menu,
  Bot
} from 'lucide-react';
import { DashboardTab } from '../types';
import VannaChat from '../components/VannaChat';
import { Badge } from '../components/UIComponents';
import SchemaPage from './SchemaPage';
import ContextPage from './ContextPage';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SchemaView = ({ isDark }: { isDark: boolean }) => {
  const textColor = isDark ? 'text-slate-300' : 'text-slate-600';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Database Schema</h2>
        <p className={textColor}>Visualizing the Hospitality Dataset structure</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {['Reservations', 'Customers', 'Golf_Bookings', 'Spa_Services', 'Restaurants', 'Payments'].map((table, i) => (
           <motion.div 
             key={table}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={`${bgColor} ${borderColor} border rounded-xl p-4 shadow-sm relative z-10 group hover:border-primary-500 transition-colors`}
           >
             <div className="flex items-center space-x-2 mb-3 border-b pb-2 border-dashed border-slate-600/30">
               <Database className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
               <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{table}</h3>
             </div>
             <ul className={`text-sm space-y-2 ${textColor}`}>
               <li className="flex justify-between"><span>id</span> <span className="text-xs opacity-50 font-mono">PK INT</span></li>
               <li className="flex justify-between"><span>created_at</span> <span className="text-xs opacity-50 font-mono">DATETIME</span></li>
               <li className="flex justify-between"><span>status</span> <span className="text-xs opacity-50 font-mono">VARCHAR</span></li>
               {table === 'Reservations' && <li className="flex justify-between"><span>customer_id</span> <span className="text-xs opacity-50 font-mono">FK INT</span></li>}
               {table === 'Payments' && <li className="flex justify-between"><span>amount</span> <span className="text-xs opacity-50 font-mono">DECIMAL</span></li>}
             </ul>
           </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContextView = ({ isDark }: { isDark: boolean }) => (
  <div className="p-6 h-full overflow-y-auto">
    <div className="mb-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>System Context</h2>
      <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Current DDL and Documentation available to the AI</p>
    </div>
    <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-6 font-mono text-sm overflow-x-auto`}>
      <pre className="text-primary-600 dark:text-primary-400">
{`-- Current DDL Context
CREATE TABLE Reservations (
    id INT PRIMARY KEY,
    customer_id INT,
    check_in DATE,
    check_out DATE,
    room_type VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

-- Documentation
"Golf bookings are handled separately but linked via customer_id. 
Spa services can be booked during a reservation stay."
`}
      </pre>
    </div>
  </div>
);

const TrainingView = ({ isDark }: { isDark: boolean }) => (
  <div className="p-6 h-full overflow-y-auto">
    <div className="mb-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Training Data</h2>
      <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Manage QA pairs and automatic training pipelines via n8n.</p>
    </div>
    
    <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-xl p-8 border ${isDark ? 'border-slate-700' : 'border-slate-200'} text-center`}>
      <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-primary-500 opacity-80" />
      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Auto-Train with n8n</h3>
      <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Connect your Excel/CSV data source. The n8n workflow will parse questions and SQL pairs to fine-tune Vanna AI automatically.
      </p>
      <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
        Connect Data Source
      </button>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.CHAT);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: DashboardTab.CHAT, icon: MessageSquare, label: 'Chat' },
    { id: DashboardTab.SCHEMA, icon: Database, label: 'Schema' },
    { id: DashboardTab.CONTEXT, icon: History, label: 'Context' },
    { id: DashboardTab.TRAINING, icon: BrainCircuit, label: 'Training' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static z-50 h-full w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-200'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">mantrawise</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? isDarkMode 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                      : 'bg-primary-50 text-primary-700'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800/20">
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg mb-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <span className="text-sm font-medium">Dark Mode</span>
              <button 
                onClick={toggleTheme}
                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            
            <button 
              onClick={onLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isDarkMode ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header (Mobile) */}
        <header className={`lg:hidden flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">mantrawise</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {activeTab === DashboardTab.CHAT && (
                <div className="h-full p-4 md:p-6 flex flex-col">
                  <div className="mb-4">
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Query Assistant</h1>
                    <div className="flex items-center space-x-2 mt-1">
                       <Badge color="bg-emerald-500/10 text-emerald-500">Connected to Hospitality DB</Badge>
                       <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Vanna 2.0</span>
                    </div>
                  </div>
                  <div className="flex-1 relative min-h-0">
                    <VannaChat theme={isDarkMode ? 'dark' : 'light'} />
                  </div>
                </div>
              )}
               {activeTab === DashboardTab.SCHEMA && <SchemaPage isDark={isDarkMode} />}
              {activeTab === DashboardTab.CONTEXT && <ContextPage isDark={isDarkMode} />}
              {activeTab === DashboardTab.TRAINING && <TrainingView isDark={isDarkMode} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;