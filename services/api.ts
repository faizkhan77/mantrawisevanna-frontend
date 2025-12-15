// Define Types
export interface ColumnDef {
  name: string;
  type: string;
}

export interface Relationship {
  column: string;
  target_schema: string;
  target_table: string;
  target_column: string;
}

export interface TableDef {
  schema: string;
  table: string;
  columns: ColumnDef[];
  relationships?: Relationship[];
}

// Use relative paths (Vite Proxy will forward to localhost:8000)
const API_BASE = ''; 

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const logoutUser = async () => {
  await fetch(`${API_BASE}/api/logout`, { 
    method: 'POST' 
  });
};

export const fetchDatabaseSchema = async (): Promise<TableDef[]> => {
  const res = await fetch(`${API_BASE}/api/schema`);
  if (!res.ok) throw new Error('Failed to fetch schema');
  const data = await res.json();
  return data.tables;
};

export const fetchPreferences = async (): Promise<Record<string, string>> => {
  const res = await fetch(`${API_BASE}/api/preferences`);
  return res.json();
};

export const addPreference = async (key: string, value: string) => {
  await fetch(`${API_BASE}/api/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
};

export const deletePreference = async (key: string) => {
  await fetch(`${API_BASE}/api/preferences/${key}`, { 
    method: 'DELETE' 
  });
};