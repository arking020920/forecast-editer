import { useState } from "react";

export default function TextareaModal({ title, placeholder = "", initial = "", onDone, onCancel }) {
  const [text, setText] = useState(initial);

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="mt-4 h-40 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="mt-4 flex justify-end gap-3">
        <button onClick={() => onCancel()} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">Cancelar</button>
        <button onClick={() => onDone(text)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar</button>
      </div>
    </div>
  );
}
