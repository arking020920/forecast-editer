import { useState, useEffect } from "react";
import { useForecast } from "../context/ForecastContext";

export default function useShortcuts(username) {
  const [localShortcuts, setLocalShortcuts] = useState([]);
  const { setShortcuts } = useForecast(); // 👈 traemos el setter del contexto

  useEffect(() => {
    const cached = localStorage.getItem(`shortcuts_${username}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setLocalShortcuts(parsed);
      setShortcuts(parsed); // 👈 sincroniza con contexto
    } else {
      fetch(`http://127.0.0.1:5000/config/${username}`)
        .then(res => res.json())
        .then(data => {
          const arr = data.shortcuts || [];
          setLocalShortcuts(arr);
          setShortcuts(arr); // 👈 sincroniza con contexto
          localStorage.setItem(`shortcuts_${username}`, JSON.stringify(arr));
        })
        .catch(err => console.error("Error cargando shortcuts:", err));
    }
  }, [username, setShortcuts]);

  const saveShortcuts = (newShortcuts) => {
    setLocalShortcuts(newShortcuts);
    setShortcuts(newShortcuts); // 👈 sincroniza con contexto
    localStorage.setItem(`shortcuts_${username}`, JSON.stringify(newShortcuts));
    // opcional: enviar al backend
    fetch(`http://127.0.0.1:5000/config/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortcuts: newShortcuts }),
    }).catch(err => console.error("Error guardando shortcuts:", err));
  };

  return { shortcuts: localShortcuts, saveShortcuts };
}
