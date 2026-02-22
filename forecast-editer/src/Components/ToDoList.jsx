// src/components/ToDoList.jsx
import { useTasks } from "../hooks/useTasks";

export default function ToDoList({ fechaInicio, fechaFin, fechaFin1, fechaFin2 }) {
  const { taskList, actualizarTareas, loading, toggleManual } = useTasks({ fechaInicio, fechaFin, fechaFin1, fechaFin2 });

  return (
    <section className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Lista de Tareas</h2>
        <button
          onClick={actualizarTareas}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar tareas"}
        </button>
      </div>

      <ul className="space-y-3">
        {taskList.map(task => (
          <li key={task.id} className="flex items-start justify-between bg-blue-50 p-3 rounded-md">
            <div className="flex items-center space-x-3">
              {/* Checkbox solo visual, no editable para save/saveInRed */}
              <input
                type="checkbox"
                checked={task.status === "done"}
                readOnly
                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <strong className="text-blue-700">{task.text}</strong>
                  <span className="text-sm text-blue-500">({task.deadline})</span>
                  <span className="ml-3 text-xs px-2 py-0.5 rounded bg-white border text-gray-600">
                    {task.status}
                  </span>
                </div>
                {task.type !== "correo" && task.filePattern && (
                  <div className="text-xs text-gray-500 mt-1">Busca patrón en contenido</div>
                )}
                {task.type === "saveInRed" && (
                  <div className="text-xs text-gray-500 mt-1">Archivos: {task.fileName} en Pron-Nac / telex</div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {task.type === "correo" ? (
                <button
                  onClick={() => toggleManual(task.id)}
                  className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded"
                >
                  {task.status === "done" ? "Marcar no enviado" : "Marcar enviado"}
                </button>
              ) : (
                <span className="text-xs text-gray-500">Verificado al actualizar</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
