import { useState } from "react";

export default function MultiSelectModal({ title, options = [], allowManual = true, onDone, onCancel }) {
  const [selected, setSelected] = useState([]);
  const [manualList, setManualList] = useState([]);
  const [manualInput, setManualInput] = useState("");

  const toggle = (name) => {
    setSelected(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const addManual = () => {
    const v = manualInput.trim();
    if (!v) return;
    setManualList(prev => [...prev, v]);
    setManualInput("");
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map(opt => (
          <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-md border p-2">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>

      {allowManual && (
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Agregar manualmente</label>
          <div className="mt-2 flex gap-2">
            <input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nombre del pronosticador"
            />
            <button onClick={addManual} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Añadir
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {manualList.map(m => (
              <span key={m} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                {m}
                <button onClick={() => setManualList(prev => prev.filter(x => x !== m))} className="text-gray-400 hover:text-gray-600">✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">Cancelar</button>
        <button
          onClick={() => onDone({ selected, manual: manualList })}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
