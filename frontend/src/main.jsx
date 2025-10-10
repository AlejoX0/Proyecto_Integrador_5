import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 1. Importa SOLAMENTE tu componente de la página de registro
import RegisterPage from './pages/RegisterPage';

// 2. Renderiza tu componente directamente
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterPage /> {/* <-- Aquí le decimos que muestre tu página */}
  </React.StrictMode>
);