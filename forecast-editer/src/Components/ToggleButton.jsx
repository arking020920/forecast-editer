import { useTheme } from "../context/ToggleContext";

export default function ToggleButton() {
  const { isDay, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={`relative mx-auto mt-10 cursor-pointer transition-all duration-500 
        w-[6em] h-[3.2em] rounded-full flex items-center 
        ${isDay ? "bg-[#FFBF71]" : "bg-nightBg"}`}
    >
      <div
        className={`absolute rounded-full transition-all duration-500
          ${isDay
            ? "bg-white w-[1.4em] h-[1.4em] left-[3.6em] top-[0.9em] rotate-0 shadow-sun"
            : "bg-nightBg w-[2em] h-[2em] left-[0.6em] top-[0.6em] rotate-[-75deg] shadow-moon"}`}
      />
    </div>
  );
}
