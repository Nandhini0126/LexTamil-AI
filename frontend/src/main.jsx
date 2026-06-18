import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Intercept API requests in production to point to the backend URL on Render
if (import.meta.env.PROD) {
  const apiBase = import.meta.env.VITE_API_URL || 'https://lextamil-ai-backend.onrender.com';
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      if (input.startsWith('/api/')) {
        input = `${apiBase}${input}`;
      } else if (input.startsWith(window.location.origin + '/api/')) {
        input = input.replace(window.location.origin, apiBase);
      }
    } else if (input && typeof input === 'object' && 'url' in input && typeof input.url === 'string') {
      if (input.url.startsWith('/api/')) {
        input = new Request(`${apiBase}${input.url}`, input);
      } else if (input.url.startsWith(window.location.origin + '/api/')) {
        input = new Request(input.url.replace(window.location.origin, apiBase), input);
      }
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)