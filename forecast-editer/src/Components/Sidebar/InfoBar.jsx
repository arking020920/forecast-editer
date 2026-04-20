
export default function FloatingBar({ tipoDato, fechaHora }) {
  return (
    <div
      className="
        bg-gray-900 bg-opacity-80 text-white
        px-6 py-2 rounded-lg shadow-lg
        flex items-center justify-between space-x-6
        backdrop-blur-sm mb-1
      "
    >
      <span className="text-sm font-semibold tracking-wide">
        {tipoDato}
      </span>
      <span className="text-sm italic">
        {fechaHora}
      </span>
    </div>
  );
}
