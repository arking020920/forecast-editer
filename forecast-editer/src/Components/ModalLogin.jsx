import { useState } from "react";
import { useForecast } from "../context/ForecastContext";

export default function ModalLogin({ onLogin }) {
  const {username, setUsername, setIsLogin, setUserWelcomeName, 
    setUserFirma, setUserOriginalFirma,setTempSeleccion, setElaboratedBy} = useForecast() ;
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      onLogin(data.user);
      setIsLogin(true)
      setUserWelcomeName(data.nombre)
      setUserFirma(data.firma)
      setUserOriginalFirma(data.firma)
      setTempSeleccion([data.firma])
      setElaboratedBy(data.firma)
      // Guardar usuario en estado global
    } else {
      setError(data.message);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input  
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
