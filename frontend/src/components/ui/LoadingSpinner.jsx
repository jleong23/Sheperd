/**
 * A reusable loading spinner component with a centered logo.
 * @param {boolean} fullPage - If true, it will cover the full page with a semi-transparent background.
 */
import logo from "../../assets/logo.jpg";
export default function LoadingSpinner({ fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 rounded-full border-8 border-gray-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logo}
            alt="Loading Logo"
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
      </div>
      <p className="text-lg text-gray-700 font-semibold tracking-wider">
        Loading...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80">
        {spinner}
      </div>
    );
  }

  return spinner;
}
