import React, { useEffect, useState, useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  Handle, 
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Loader2, Database, Layers, Key } from 'lucide-react';
import { fetchDatabaseSchema, TableDef } from '../services/api';

// --- CUSTOM NODE ---
const TableNode = ({ data }: any) => {
  const isDark = document.documentElement.classList.contains('dark');
  const isMart = data.schema.includes('analytics');

  return (
    <div className={`rounded-xl border min-w-[220px] shadow-xl ${
      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className={`px-3 py-2 border-b rounded-t-xl flex items-center justify-between ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      } ${isMart ? 'bg-purple-500/10' : 'bg-slate-500/10'}`}>
        <div className="flex items-center space-x-2">
          {isMart ? <Layers className="w-3 h-3 text-purple-500" /> : <Database className="w-3 h-3 text-slate-500" />}
          <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {data.label}
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="p-2 space-y-1">
        {data.columns.map((col: any, idx: number) => (
          <div key={idx} className="relative flex justify-between items-center text-[10px] px-2 py-1 hover:bg-slate-500/10 rounded group">
            <div className="flex items-center space-x-1">
               {/* Identify Keys visually */}
               {(col.name.toLowerCase() === 'id' || 
                 col.name.toLowerCase().endsWith('id')) && 
                 <Key className="w-2 h-2 text-emerald-500" />
               }
               <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{col.name}</span>
            </div>
            <span className="font-mono text-[9px] opacity-40">{col.type}</span>
            
            {/* Connection Handles */}
            <Handle type="source" position={Position.Right} id={`${col.name}-source`} className="!w-1.5 !h-1.5 !bg-slate-400" />
            <Handle type="target" position={Position.Left} id={`${col.name}-target`} className="!w-1.5 !h-1.5 !bg-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = { tableNode: TableNode };

// --- AUTO LAYOUT FUNCTION ---
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Settings for tree-like structure
  dagreGraph.setGraph({ 
    rankdir: 'LR', 
    align: 'DL',
    ranksep: 150, 
    nodesep: 50 
  });

  nodes.forEach((node) => {
    // Estimate height based on column count
    const height = 45 + (node.data.columns.length * 28);
    dagreGraph.setNode(node.id, { width: 240, height: height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 120,
        y: nodeWithPosition.y - (node.data.columns.length * 14),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const SchemaPage: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const tables = await fetchDatabaseSchema();
        
        let initialNodes: any[] = [];
        let initialEdges: any[] = [];

        // 1. Create Nodes
        tables.forEach((t) => {
          initialNodes.push({
            id: t.table,
            type: 'tableNode',
            data: { label: t.table, schema: t.schema, columns: t.columns },
            position: { x: 0, y: 0 }
          });
        });

        // 2. Create Edges (Smart Heuristic)
        tables.forEach((sourceTable) => {
          sourceTable.columns.forEach((col) => {
            const colName = col.name.toLowerCase();
            
            // Skip self-referencing primary keys named just 'id'
            if (colName === 'id') return;

            // Logic: If column is 'profileid' or 'profile_id', link to 'profiles'
            if (colName.endsWith('id')) {
               // Remove 'id' or '_id' from end
               const baseName = colName.replace(/_?id$/, ''); 
               
               // Find matching target table (Checking Singular, Plural, and 'es' plural)
               const targetTable = tables.find(t => {
                 const tName = t.table.toLowerCase();
                 return tName === baseName || 
                        tName === baseName + 's' || 
                        tName === baseName + 'es';
               });

               if (targetTable && targetTable.table !== sourceTable.table) {
                 const edgeId = `${sourceTable.table}-${col.name}-${targetTable.table}`;
                 
                 // Prevent duplicates
                 if (!initialEdges.find(e => e.id === edgeId)) {
                   initialEdges.push({
                     id: edgeId,
                     source: sourceTable.table,
                     target: targetTable.table,
                     sourceHandle: `${col.name}-source`,
                     targetHandle: `id-target`, // Ideally link to target's PK 'id', or just target node
                     animated: true,
                     style: { stroke: isDark ? '#94a3b8' : '#64748b', strokeWidth: 1.5 },
                     markerEnd: { type: MarkerType.ArrowClosed },
                   });
                 }
               }
            }
          });
        });

        // 3. Apply Layout
        const layout = getLayoutedElements(initialNodes, initialEdges);
        setNodes(layout.nodes);
        setEdges(layout.edges);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isDark, setNodes, setEdges]);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className={isDark ? 'dark' : ''}
      >
        <Controls className={isDark ? 'bg-slate-800 border-slate-700 fill-white' : 'bg-white'} />
        <MiniMap 
          nodeColor={n => n.data.schema.includes('analytics') ? '#a855f7' : '#64748b'} 
          className={isDark ? 'bg-slate-900' : 'bg-white'} 
        />
        <Background color={isDark ? '#334155' : '#cbd5e1'} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};

export default SchemaPage;