export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-gray-200 transform transition-all duration-200 ease-out">
        {children}
      </div>
    </div>
  );
}
