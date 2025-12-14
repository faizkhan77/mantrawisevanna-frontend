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
      // 1. Load Plotly (REQUIRED for charts to render)
      if (!window.Plotly) {
        const plotlyScript = document.createElement('script');
        plotlyScript.src = "https://cdn.plot.ly/plotly-latest.min.js";
        plotlyScript.type = "text/javascript";
        plotlyScript.async = true;
        document.head.appendChild(plotlyScript);
        await new Promise((resolve) => { plotlyScript.onload = resolve; });
      }

      // 2. Load Vanna Component
      if (!document.querySelector('script[src="https://img.vanna.ai/vanna-components.js"]')) {
        const vannaScript = document.createElement('script');
        vannaScript.src = "https://img.vanna.ai/vanna-components.js";
        vannaScript.type = "module";
        vannaScript.async = true;
        document.head.appendChild(vannaScript);
        // We don't necessarily need to wait for this to resolve to set true, 
        // but it ensures order.
      }
      
      setScriptsLoaded(true);
    };

    loadDependencies();
  }, []);

  // Optional: Debugging listener to ensure artifacts are being received
  useEffect(() => {
    const element = chatRef.current;
    if (element && scriptsLoaded) {
      const handleArtifact = (event: any) => {
        // If you see this log but no chart, check the console for Plotly errors
        console.log('Vanna Artifact Generated:', event.detail); 
      };

      element.addEventListener('artifact-opened', handleArtifact);
      return () => element.removeEventListener('artifact-opened', handleArtifact);
    }
  }, [scriptsLoaded]);

  if (!scriptsLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 animate-pulse">
        Loading Visualization Engine...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden rounded-xl bg-slate-900/30 border border-slate-800/50">
      <vanna-chat
        ref={chatRef}
        api-base="http://localhost:8000"
        sse-endpoint="http://localhost:8000/api/vanna/v2/chat_sse"
        ws-endpoint="http://localhost:8000/api/vanna/v2/chat_websocket"
        poll-endpoint="http://localhost:8000/api/vanna/v2/chat_poll"
        theme={theme}
        debug="true"
        className="w-full h-full block" // Added 'block' to ensure it takes space
      ></vanna-chat>
    </div>
  );
};

export default VannaChat;