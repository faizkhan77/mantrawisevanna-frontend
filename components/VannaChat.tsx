import React, { useEffect, useRef, useState } from 'react';

// TypeScript definitions
declare global {
  interface Window {
    Plotly?: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'vanna-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'api-base'?: string;
        'sse-endpoint'?: string;
        'ws-endpoint'?: string;
        'poll-endpoint'?: string;
        'theme'?: 'light' | 'dark';
        'debug'?: string;
        ref?: React.RefObject<HTMLElement>;
      };
    }
  }
}

interface VannaChatProps {
  theme: 'dark' | 'light';
}

const VannaChat: React.FC<VannaChatProps> = ({ theme }) => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const chatRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadDependencies = async () => {
      // 1. Load Plotly
      if (!window.Plotly) {
        const plotlyScript = document.createElement('script');
        plotlyScript.src = "https://cdn.plot.ly/plotly-latest.min.js";
        plotlyScript.type = "text/javascript";
        plotlyScript.async = true;
        document.head.appendChild(plotlyScript);
        await new Promise((resolve) => { plotlyScript.onload = resolve; });
      }

      // 2. Load Vanna
      if (!document.querySelector('script[src="https://img.vanna.ai/vanna-components.js"]')) {
        const vannaScript = document.createElement('script');
        vannaScript.src = "https://img.vanna.ai/vanna-components.js";
        vannaScript.type = "module";
        vannaScript.async = true;
        document.head.appendChild(vannaScript);
      }
      setScriptsLoaded(true);
    };
    loadDependencies();
  }, []);

  if (!scriptsLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-slate-500 animate-pulse">Loading...</div>;
  }

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden rounded-xl bg-slate-900/30 border border-slate-800/50">
      <vanna-chat
        ref={chatRef}
        api-base="" 
        sse-endpoint="/api/vanna/v2/chat_sse"
        ws-endpoint="/api/vanna/v2/chat_websocket"
        poll-endpoint="/api/vanna/v2/chat_poll"
        theme={theme}
        debug="true"
        className="w-full h-full block"
      ></vanna-chat>
      
      {/* 
         This style block forces markdown styling inside the shadow DOM if possible, 
         or at least ensures the container provides correct contrast 
      */}
      <style>{`
        vanna-chat::part(message-content) {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.6;
        }
        vanna-chat::part(message-content) strong {
          color: ${theme === 'dark' ? '#38bdf8' : '#0284c7'};
          font-weight: 700;
        }
        vanna-chat::part(message-content) ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default VannaChat;