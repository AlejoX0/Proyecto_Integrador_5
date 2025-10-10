// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Asegúrate que la ruta a tu archivo sea correcta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Aquí puedes agregar más rutas en el futuro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;