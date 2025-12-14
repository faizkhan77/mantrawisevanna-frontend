import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Table, Loader2, Layers } from 'lucide-react';
import { fetchDatabaseSchema, TableDef } from '../services/api';
import { Badge } from '../components/UIComponents';

interface SchemaPageProps {
  isDark: boolean;
}

const SchemaPage: React.FC<SchemaPageProps> = ({ isDark }) => {
  const [tables, setTables] = useState<TableDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const data = await fetchDatabaseSchema();
        setTables(data);
      } catch (err) {
        setError('Failed to load database schema.');
      } finally {
        setLoading(false);
      }
    };
    loadSchema();
  }, []);

  const textColor = isDark ? 'text-slate-300' : 'text-slate-600';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Error: {error}
      </div>
    );
  }

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  // ADD THIS CHECK:
  if (tables.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-slate-500">
        <Database className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium">No Tables Found</h3>
        <p className="text-sm">Check your database connection or schema permissions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Database Schema</h2>
        <p className={textColor}>Live metadata from MS SQL Server</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {tables.map((table, i) => (
           <motion.div 
             key={`${table.schema}.${table.table}`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className={`${bgColor} ${borderColor} border rounded-xl p-4 shadow-sm relative z-10 group hover:border-primary-500 transition-colors flex flex-col`}
           >
             <div className="flex items-center justify-between mb-3 border-b pb-2 border-dashed border-slate-600/30">
               <div className="flex items-center space-x-2">
                 {table.schema.includes('analytics') ? (
                    <Layers className="w-4 h-4 text-purple-400" />
                 ) : (
                    <Database className="w-4 h-4 text-slate-500" />
                 )}
                 <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'} truncate max-w-[150px]`}>
                    {table.table}
                 </h3>
               </div>
               <Badge color={table.schema.includes('analytics') ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-500/20 text-slate-400'}>
                 {table.schema === 'analytics_analytics' ? 'MART' : table.schema}
               </Badge>
             </div>
             
             <div className="flex-1 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
               <ul className={`text-sm space-y-2 ${textColor}`}>
                 {table.columns.map((col) => (
                   <li key={col.name} className="flex justify-between items-center group/row">
                     <span className="group-hover/row:text-primary-400 transition-colors">{col.name}</span> 
                     <span className="text-[10px] opacity-50 font-mono bg-slate-900/50 px-1.5 py-0.5 rounded">
                        {col.type.toUpperCase()}
                     </span>
                   </li>
                 ))}
               </ul>
             </div>
           </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SchemaPage;