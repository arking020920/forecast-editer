import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
        {children}
      </div>
    </div>,
    document.body
  );
}
