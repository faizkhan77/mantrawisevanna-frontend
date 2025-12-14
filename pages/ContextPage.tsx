import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, Save, FileText } from 'lucide-react';
import { Button, Input, Card } from '../components/UIComponents';
import { fetchPreferences, addPreference, deletePreference } from '../services/api';

interface ContextPageProps {
  isDark: boolean;
}

const ContextPage: React.FC<ContextPageProps> = ({ isDark }) => {
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPrefs = async () => {
    try {
      const data = await fetchPreferences();
      setPrefs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPrefs(); }, []);

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    // Optimistic update
    const temp = { ...prefs, [newKey]: newValue };
    setPrefs(temp);
    setNewKey('');
    setNewValue('');
    await addPreference(newKey, newValue);
  };

  const handleDelete = async (key: string) => {
    const temp = { ...prefs };
    delete temp[key];
    setPrefs(temp);
    await deletePreference(key);
  };

  const textColor = isDark ? 'text-slate-300' : 'text-slate-600';
  const inputBg = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Agent Context</h2>
        <p className={textColor}>Define global preferences that shape how the AI behaves.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Preferences Editor */}
        <div className="space-y-6">
          <Card className={`border ${borderColor} ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>User Preferences</h3>
            </div>
            
            {/* List */}
            <div className="space-y-3 mb-6">
              <AnimatePresence>
                {Object.entries(prefs).map(([key, value]) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${borderColor} ${inputBg}`}
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <span className={`font-mono text-sm text-primary-500`}>{key}</span>
                      <span className={`text-sm ${textColor}`}>{value}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(key)}
                      className="ml-4 p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {Object.keys(prefs).length === 0 && !loading && (
                <div className="text-center py-8 text-slate-500 text-sm italic">
                  No preferences set. Add one below.
                </div>
              )}
            </div>

            {/* Add New */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4 border-t border-dashed border-slate-700">
              <div className="sm:col-span-2">
                <Input 
                  placeholder="Key (e.g. Location)" 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Input 
                  placeholder="Value (e.g. India)" 
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button onClick={handleAdd} disabled={!newKey || !newValue} className="px-0">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Read-Only System Docs */}
        <div>
          <Card className={`border ${borderColor} ${isDark ? 'bg-slate-900/50' : 'bg-white'} h-full`}>
             <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>System Documentation</h3>
            </div>
            <div className={`p-4 rounded-lg border ${borderColor} ${inputBg} font-mono text-xs ${textColor} overflow-x-auto whitespace-pre-wrap`}>
{`-- Static Documentation (from .md)
Golf bookings are linked via profile_id.
VIP Status is 1 (True) or 0 (False).
Revenue aggregates include Taxes.
`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContextPage;