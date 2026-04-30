// components/kids/KidsCardSkeleton.jsx
export default function KidsCardSkeleton() {
  return (
    <div className="border rounded-xl shadow-sm bg-white p-5 flex flex-col gap-4 animate-pulse relative">
      {/* main content */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* avatar */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-300" />

        {/* details */}
        <div className="space-y-2 w-full">
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
          <div className="h-3 w-1/3 bg-gray-300 rounded" />
          <div className="h-3 w-2/3 bg-gray-300 rounded" />
        </div>
      </div>

      {/* phone section */}
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
