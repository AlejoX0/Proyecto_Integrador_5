import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. IMPORTA BrowserRouter
import './index.css';
import RegisterPage from './pages/RegisterPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. ENVUELVE tu página con el componente BrowserRouter */}
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  </React.StrictMode>
);