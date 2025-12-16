export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // click on overlay closes modal
    >
      <div
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl animate-modalOpen"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>    </div>
  );
}
