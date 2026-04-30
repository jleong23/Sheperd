// components/ui/StatCardSkeleton.jsx
export default function StatCardSkeleton() {
  return (
    <div className="flex items-center p-6 bg-white rounded-xl shadow animate-pulse">
      {/* icon circle */}
      <div className="w-12 h-12 rounded-full bg-gray-300 mr-4" />

      <div className="flex-1 space-y-3">
        {/* label */}
        <div className="h-4 w-32 bg-gray-300 rounded" />

        {/* value */}
        <div className="h-8 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
