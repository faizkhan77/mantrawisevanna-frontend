// src/hooks/useVannaChat.ts
import { useState, useRef } from 'react';
import { API_BASE_URL, getAuthHeaders } from '../services/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'sql' | 'data' | 'chart' | 'error' | 'thinking';
  content?: string; // For text, SQL, or error messages
  data?: any;       // For DataFrame or Chart JSON
  title?: string;
}

export const useVannaChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome', role: 'assistant', type: 'text',
      content: "Hello! I'm connected to your Hospitality Database. Ask me anything about guests, revenue, or bookings."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: text };
    setMessages(prev => [...prev, userMsg, { id: 'thinking', role: 'assistant', type: 'thinking' }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/vanna/v2/chat_sse`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: text, conversation_id: 'default-session' })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Remove the initial "thinking" message
      setMessages(prev => [...prev.slice(0, -1)]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          
          try {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') break;
            
            const payload = JSON.parse(jsonStr);
            const component = payload.rich_component;
            
            if (!component) continue;
            const componentType = component.__class__.__name__;

            // --- ROBUST PARSING LOGIC ---
            switch(componentType) {
              case 'RichTextComponent':
                if (component.content) {
                  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'text', content: component.content }]);
                }
                break;
              
              case 'CodeEditorComponent':
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'sql', content: component.code, title: 'Generated SQL' }]);
                break;

              case 'DataFrameComponent':
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'data', data: component.data, title: 'Query Results' }]);
                break;

              case 'PlotlyComponent':
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'chart', data: component, title: 'Chart' }]);
                break;
              
              case 'NotificationComponent':
              case 'StatusCardComponent':
                 if (component.status === 'error') {
                   setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'error', content: component.description || 'An error occurred.' }]);
                 }
                 break;
            }

          } catch (e) { console.warn("SSE Parse error", e); }
        }
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => m.type !== 'thinking')); // Clean up on error
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', type: 'error', content: "Failed to connect to server." }]);
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    }
  };

  return { messages, sendMessage, isLoading };
};