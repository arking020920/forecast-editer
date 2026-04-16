// src/components/AnimatedWave.jsx
import { renderToStaticMarkup } from "react-dom/server";

const AnimatedWave = ({ color, animationDuration, animationDirection = "normal", opacity }) => {
  // SVG de la ola
  const wave = (
    <svg viewBox="0 0 1000 126" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 42.9533C178.148 -12.5894 287.4 -13.7474 500 42.9533C682.727 88.1203 798.763 97.7368 1000 42.9533V125.861H0V42.9533Z"
        fill={color}
      />
    </svg>
  );

  // Convertir SVG a string
  const svgAsString = renderToStaticMarkup(wave);
  // Codificar para usarlo como background
  const encodedWaveSvg = encodeURIComponent(svgAsString);

  return (
    <div
      style={{
        background: `url('data:image/svg+xml;utf8,${encodedWaveSvg}')`,
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 126,
        backgroundSize: "1000px 126px",
        animation: `wave ${animationDuration} linear infinite`,
        animationDirection: animationDirection,
        opacity: opacity,
      }}
    ></div>
  );
};

export default AnimatedWave;

