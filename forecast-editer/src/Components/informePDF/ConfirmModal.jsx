
export default function ConfirmModal({ title, message, details = [], onClose }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>

      <div className="mt-4 max-h-48 overflow-auto rounded-md border border-gray-100 p-3">
        {details.length === 0 ? (
          <p className="text-sm text-gray-500">No hay detalles.</p>
        ) : (
          <ul className="space-y-2">
            {details.map(d => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{d.name}</span>
                <span className="text-xs text-gray-400">ID {d.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => onClose(false)}
          className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          No
        </button>
        <button
          onClick={() => onClose(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Sí, generar informe
        </button>
      </div>
    </div>
  );
}
