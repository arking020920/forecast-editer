// src/components/LoadingSpinner.jsx
import AnimatedWave from "./AnimatedWave";

export default function LoadingSpinner() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[40vh] bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden mb-8 rounded-md">
      {/* Olas animadas en el fondo */}
      <AnimatedWave
        color="#3b82f6"              // azul Tailwind 600
        animationDuration="8s"
        animationDirection="normal"
        opacity={0.5}
      />
      <AnimatedWave
        color="#60a5fa"              // azul Tailwind 400
        animationDuration="12s"
        animationDirection="reverse"
        opacity={0.4}
      />
      <AnimatedWave
        color="#93c5fd"              // azul Tailwind 300
        animationDuration="16s"
        animationDirection="normal"
        opacity={0.3}
      />

      {/* Spinner circular */}
      <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin z-10"></div>

      {/* Texto creativo */}
      <p className="mt-6 text-lg font-semibold text-blue-700 animate-pulse z-10">
       Buscando en la marea de datos...
      </p>
    </div>
  );
}
