
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Ensure diagnostics can track the start of execution
console.log("NOUN CRM: Mounting React application...");

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mount Error:", err);
    // Explicitly push error to the UI overlay if React fails
    window.onerror(err.message, 'index.tsx', 0);
  }
} else {
  console.error("Root element not found in DOM");
}
