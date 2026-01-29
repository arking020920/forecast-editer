import { useState } from "react";
import { createPortal } from "react-dom";

export default function ConfigModal({ username, shortcuts, onSave, onClose }) {
  const [newId, setNewId] = useState("");
  const [newPhrase, setNewPhrase] = useState("");
  const [openManage, setOpenManage] = useState(false);

  // Añadir un nuevo atajo
  const addShortcut = () => {
    if (!newId || !newPhrase) return;

    let idNum = parseInt(newId);
    if (idNum < 1) {
      alert("El número de atajo debe ser mayor o igual a 1");
      return;
    }
    if (shortcuts.some(s => s.id === idNum)) {
      alert("Ya existe un atajo con ese número");
      return;
    }

    const updated = [...shortcuts, { id: idNum, phrase: newPhrase }];
    onSave(updated);
    setNewId("");
    setNewPhrase("");
  };

  // Buscar el siguiente número disponible
  const getNextAvailableId = (currentId, index) => {
    let candidate = currentId;
    while (
      candidate < 1 ||
      shortcuts.some((s, i) => i !== index && s.id === candidate)
    ) {
      candidate++;
    }
    return candidate;
  };

  // Actualizar un atajo existente
  const updateShortcut = (index, field, value) => {
    const updated = [...shortcuts];
    if (field === "id") {
      let idNum = parseInt(value);
      if (isNaN(idNum)) return;
      if (idNum < 1) idNum = 1;
      idNum = getNextAvailableId(idNum, index);
      updated[index].id = idNum;
    } else {
      updated[index][field] = value;
    }
    onSave(updated);
  };

  // Eliminar un atajo
  const removeShortcut = (index) => {
    const updated = shortcuts.filter((_, i) => i !== index);
    onSave(updated);
  };

  return createPortal(
     <div className="fixed inset-0 w-screen h-screen bg-black/70 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Configuración de Atajos</h2>

        {/* Formulario para añadir nuevo atajo */}
        <input
          type="number"
          placeholder="Número del atajo"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Frase asociada"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={addShortcut}
          className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 mb-4"
        >
          Añadir Atajo
        </button>

        {/* Botón para gestionar atajos existentes */}
        {shortcuts.length > 0 && (
          <button
            onClick={() => setOpenManage(true)}
            className="bg-gray-600 text-white py-1 px-4 rounded hover:bg-gray-700 mb-4"
          >
            Gestionar Atajos
          </button>
        )}

        {/* Botón cerrar */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal fullscreen de gestión */}
      {openManage && (
        <div className="fixed inset-0 w-screen h-screen bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 h-5/6 rounded shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">Gestionar Atajos</h2>

            <div className="flex-1 overflow-y-auto">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center space-x-2 mb-4">
                  <input
                    type="number"
                    value={s.id}
                    onChange={(e) => updateShortcut(i, "id", e.target.value)}
                    className="w-20 border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={s.phrase}
                    onChange={(e) => updateShortcut(i, "phrase", e.target.value)}
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    onClick={() => removeShortcut(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setOpenManage(false)}
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700"
              >
                Cerrar Gestión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>, document.body
  );
}
