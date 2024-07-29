import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode style={{ height: '100%' }}>
    <App style={{ height: '100%' }}/>
  </React.StrictMode>
);
