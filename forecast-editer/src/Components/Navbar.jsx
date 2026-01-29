// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo o título */}
          <div className="flex-shrink-0 text-white font-bold text-xl tracking-wide">
            Forecast Editor
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            <Link
              to="/editor"
              className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium"
            >
              Editor
            </Link>
            <Link
              to="/descargador"
              className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium"
            >
              Descargador de Datos
            </Link>
            <Link
              to="/info"
              className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium"
            >
              Info
            </Link>
            <Link
              to="/acerca"
              className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium"
            >
              Acerca
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
