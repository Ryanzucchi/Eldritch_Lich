'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Load EditorComponent dynamically, disabling SSR to avoid node/wasm binary loading issues on server
const EditorComponent = dynamic(() => import('./EditorComponent'), {
  ssr: false,
  loading: () => (
    <div className="editor-loading-screen">
      <div className="loader-text">Inicializando Editor de Manuscritos...</div>
      <style jsx>{`
        .editor-loading-screen {
          background-color: #07070a;
          color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: sans-serif;
          font-size: 1.1rem;
        }
        .loader-text {
          padding: 1rem 2rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
});

export default function EditorPage() {
  return <EditorComponent />;
}
