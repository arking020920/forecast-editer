import { useState } from "react";
import ModalLogin from "./Components/ModalLogin";
import { ForecastProvider } from "./context/ForecastContext";
import EditorLayout from "./Components/EditorLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"; // 👈 Importamos el Navbar

function App() {
  const [user, setUser] = useState(null);

  // Si no hay usuario logueado, mostrar modal de login
  if (!user) {
    return <ModalLogin onLogin={setUser} />;
  }

  // Si hay usuario logueado, mostrar la aplicación completa
  return (
    <ForecastProvider>
      <BrowserRouter>
        {/* Navbar siempre visible */}
        <Navbar />

        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Bienvenido {user}</h1>
          <Routes>
            <Route path="/editor" element={<EditorLayout />} />
            {/* 👇 puedes añadir más rutas según los links del Navbar */}
            <Route path="/descargador" element={<div>Descargador de Datos</div>} />
            <Route path="/info" element={<div>Información</div>} />
            <Route path="/acerca" element={<div>Acerca de la aplicación</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ForecastProvider>
  );
}

export default App;
