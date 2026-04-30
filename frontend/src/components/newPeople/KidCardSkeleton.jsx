// components/newPeople/KidCardSkeleton.jsx
export default function KidCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white animate-pulse">
      {/* header */}
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-40 bg-gray-300 rounded" />
          <div className="h-3 w-36 bg-gray-300 rounded" />
        </div>

        <div className="space-y-2 items-end flex flex-col">
          <div className="h-6 w-16 bg-gray-300 rounded" />
          <div className="h-6 w-6 bg-gray-300 rounded" />
        </div>
      </div>

      {/* call sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>

      {/* button */}
      <div className="mt-4 flex justify-end">
        <div className="h-9 w-28 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
