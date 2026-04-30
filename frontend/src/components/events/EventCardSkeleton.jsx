// components/events/EventCardSkeleton.jsx
export default function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 animate-pulse">
      {/* title */}
      <div className="h-5 w-2/3 bg-gray-300 rounded mb-3" />

      {/* lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded" />
        <div className="h-3 w-5/6 bg-gray-300 rounded" />
        <div className="h-3 w-4/6 bg-gray-300 rounded" />
      </div>

      {/* button row */}
      <div className="flex justify-end gap-2 mt-4">
        <div className="h-8 w-14 bg-gray-300 rounded" />
        <div className="h-8 w-14 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
