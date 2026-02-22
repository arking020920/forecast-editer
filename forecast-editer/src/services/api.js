// src/services/api.js
const BASE_URL = "http://localhost:5000/api";

export async function checkSave({ fullPath }) {
  const res = await fetch(`${BASE_URL}/check-save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullPath }),
  });
  return res.json();
}

export async function checkSaveInRed({ fileName, routes, expectedPattern }) {
  const res = await fetch(`${BASE_URL}/check-save-in-red`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, routes, expectedPattern }),
  });
  return res.json();
}
