import StatCardSkeleton from "./StatCardSkeleton.jsx";

export default function GroupStats({ yearLevel, stats, loading }) {
  return (
    <section className="bg-gray-200 p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-5xl font-bold text-center mb-10 text-blue-900">
        Group Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Year Level */}
            <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
              <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
                🏫
              </div>
              <div>
                <p className="text-gray-500 font-medium text-lg">Year Level</p>
                <p className="text-3xl font-bold text-[#E07B13]">
                  {yearLevel ?? "Unavailable"}
                </p>
              </div>
            </div>

            {/* Number of Kids */}
            <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
              <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
                🤦🏼‍♂️
              </div>
              <div>
                <p className="text-gray-500 font-medium text-lg">
                  Number of kids in this group
                </p>
                <p className="text-3xl font-bold text-[#E07B13]">
                  {stats?.total_kids ?? "Unavailable"}
                </p>
              </div>
            </div>

            {/* Kids Baptised */}
            <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
              <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
                💧
              </div>
              <div>
                <p className="text-gray-500 font-medium text-lg">
                  Kids Baptised
                </p>
                <p className="text-3xl font-bold text-[#E07B13]">
                  {stats?.baptised_kids ?? "Unavailable"}
                </p>
              </div>
            </div>

            {/* Sunday Service */}
            <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
              <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
                ⛪️
              </div>
              <div>
                <p className="text-gray-500 font-medium text-lg">
                  Comes Sunday Service
                </p>
                <p className="text-3xl font-bold text-[#E07B13]">
                  {stats?.regular_kids ?? "Unavailable"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
