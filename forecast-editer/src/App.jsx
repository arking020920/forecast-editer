import { useState } from "react";
import ModalLogin from "./Components/ModalLogin";
import EditorLayout from "./Components/EditorLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"; // 👈 Importamos el Navbar
import { useForecast } from "./context/ForecastContext";
function App() {
  const {username, setUsername, isLogin, userWelcomeName} = useForecast();

  // Si no hay usuario logueado, mostrar modal de login
  if (!username || !isLogin) {
    return <ModalLogin onLogin={setUsername} />;
  }

  // Si hay usuario logueado, mostrar la aplicación completa
  return (
      <BrowserRouter>
        {/* Navbar siempre visible */}
        <Navbar />

        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Bienvenido {userWelcomeName}</h1>
          <Routes>
            <Route path="/editor" element={<EditorLayout />} />
            {/* 👇 puedes añadir más rutas según los links del Navbar */}
            <Route path="/descargador" element={<div>Descargador de Datos</div>} />
            <Route path="/info" element={<div>Información</div>} />
            <Route path="/acerca" element={<div>Acerca de la aplicación</div>} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
