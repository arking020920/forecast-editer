import EditorNavbar from "./EditorNavbar";
import Writer from "./Writer";
import Sidebar from "./Sidebar";

export default function EditorLayout() {
  return (
    <div className="flex h-screen">
      {/* Columna 2/3 */}
      <div className="w-2/3 flex flex-col bg-gray-50">
        <EditorNavbar />
        <Writer />
      </div>

      {/* Columna 1/3 */}
      <div className="w-1/3 bg-gradient-to-b from-gray-200 to-gray-400 shadow-lg">
        <Sidebar />
      </div>
    </div>
  );
}
