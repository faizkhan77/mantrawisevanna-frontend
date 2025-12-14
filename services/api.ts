export const API_BASE_URL = 'http://localhost:8000';

export interface ColumnDef {
  name: string;
  type: string;
}

export interface TableDef {
  schema: string;
  table: string;
  columns: ColumnDef[];
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('vanna_auth_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export const fetchDatabaseSchema = async (): Promise<TableDef[]> => {
  const response = await fetch(`${API_BASE_URL}/api/schema`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch schema');
  }
  
  const data = await response.json();
  return data.tables;
};


export const fetchPreferences = async (): Promise<Record<string, string>> => {
  const response = await fetch(`${API_BASE_URL}/api/preferences`, { headers: getAuthHeaders() });
  return response.json();
};

export const addPreference = async (key: string, value: string) => {
  await fetch(`${API_BASE_URL}/api/preferences`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ key, value })
  });
};

export const deletePreference = async (key: string) => {
  await fetch(`${API_BASE_URL}/api/preferences/${key}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
};