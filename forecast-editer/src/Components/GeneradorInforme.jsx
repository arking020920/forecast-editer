import { useState } from "react";
import ModalPortal from "./informePDF/ModalPortal";
import ConfirmModal from "./informePDF/ConfirmModal";
import MultiSelectModal from "./informePDF/MultiSelectModal";
import TextareaModal from "./informePDF/TextareaModal";

/**
 * Props:
 *  - taskList: array de tareas { id, fileName, fullPath, status }
 *  - fecha: Date o ISO string
 *  - pronosticadoresOptions: array de strings
 */
export function GeneradorInforme({ taskList = [], fecha = new Date(), pronosticadoresOptions = [] }) {
  const [showConfirmMissing, setShowConfirmMissing] = useState(false);
  const [missingTasks, setMissingTasks] = useState([]);
  const [showPronosticadores, setShowPronosticadores] = useState(false);
  const [selectedPronosticadores, setSelectedPronosticadores] = useState([]);
  const [manualPronosticadores, setManualPronosticadores] = useState([]);
  const [taskObservations, setTaskObservations] = useState({});
  const [taskObsIndex, setTaskObsIndex] = useState(null); // null = no modal, >=0 index in missingTasks, -1 = general obs
  const [generalObservation, setGeneralObservation] = useState("");
  const [loading, setLoading] = useState(false);

  const allDone = taskList.every(t => t.status === "done");

  const handleClick = () => {
    const missing = taskList.filter(t => t.status !== "done");
    setMissingTasks(missing);
    if (missing.length > 0) {
      setShowConfirmMissing(true);
    } else {
      setShowPronosticadores(true);
    }
  };

  const confirmGenerateDespiteMissing = (confirm) => {
    setShowConfirmMissing(false);
    if (confirm) setShowPronosticadores(true);
  };

  const onPronosticadoresDone = ({ selected, manual }) => {
    setSelectedPronosticadores(selected);
    setManualPronosticadores(manual);
    if (missingTasks.length > 0) {
      setTaskObsIndex(0);
    } else {
      setTaskObsIndex(-1); // abrir observaciones generales
    }
    setShowPronosticadores(false);
  };

  const saveTaskObservationAndNext = (taskId, text) => {
    setTaskObservations(prev => ({ ...prev, [taskId]: text }));
    const next = taskObsIndex + 1;
    if (next < missingTasks.length) {
      setTaskObsIndex(next);
    } else {
      setTaskObsIndex(-1);
    }
  };

  const onGeneralObservationDone = (text) => {
    setGeneralObservation(text);
    setTaskObsIndex(null);
    // iniciar generación
    generatePdf();
  };

  const generatePdf = async () => {
    setLoading(true);
    try {
      const checkedTasks = taskList.filter(t => t.status === "done");
      const payload = {
        fecha: (new Date(fecha)).toISOString(),
        pronosticadores: [...selectedPronosticadores, ...manualPronosticadores],
        tasksSummary: taskList.filter(t => t.type==='save').map(t => ({
          id: t.id,
          name: t.fileName || t.id,
          checked: t.status === "done",
          observation: taskObservations[t.id] || null
        })),
        generalObservation,
        checkedFullPaths: checkedTasks.filter(t => t.type==='save').map(t => t.fullPath)
      };

      console.log("Payload que enviamos al backend:", payload);

      const res = await fetch("http://localhost:5000/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
  

      

      if (!res.ok) throw new Error("Error al generar PDF en servidor");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Informe_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error generando el PDF: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
      >
        {loading ? "Generando..." : "Generar Informe"}
      </button>

      {showConfirmMissing && (
        <ModalPortal>
          <ConfirmModal
            title="Faltan tareas por completar"
            message={`Faltan ${missingTasks.length} tareas. ¿Deseas generar el informe de todos modos?`}
            details={missingTasks.map(t => ({ id: t.id, name: t.fileName || t.id }))}
            onClose={confirmGenerateDespiteMissing}
          />
        </ModalPortal>
      )}

      {showPronosticadores && (
        <ModalPortal>
          <MultiSelectModal
            title="Seleccionar Pronosticadores"
            options={pronosticadoresOptions}
            allowManual={true}
            onDone={onPronosticadoresDone}
            onCancel={() => setShowPronosticadores(false)}
          />
        </ModalPortal>
      )}

      {taskObsIndex !== null && taskObsIndex >= 0 && taskObsIndex < missingTasks.length && (
        <ModalPortal>
          <TextareaModal
            title={`Observación para tarea: ${missingTasks[taskObsIndex].fileName || missingTasks[taskObsIndex].id}`}
            placeholder="Escribe una observación que aparecerá debajo de la tarea en el informe"
            onDone={(text) => saveTaskObservationAndNext(missingTasks[taskObsIndex].id, text)}
            onCancel={() => saveTaskObservationAndNext(missingTasks[taskObsIndex].id, "")}
          />
        </ModalPortal>
      )}

      {taskObsIndex === -1 && (
        <ModalPortal>
          <TextareaModal
            title="Observaciones generales"
            placeholder="Escribe observaciones generales del turno"
            onDone={onGeneralObservationDone}
            onCancel={() => onGeneralObservationDone("")}
          />
        </ModalPortal>
      )}
    </>
  );
}
