import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
const REACT_APP_GOOGLE_ID = process.env.REACT_APP_GOOGLE_ID;
root.render(
        <App />
);
