import StatCardSkeleton from "./StatCardSkeleton.jsx";

export default function GroupStats({ yearLevel, stats, loading }) {
  const cards = [
    { label: "Year Level", value: yearLevel ?? "Unavailable", icon: "🏫" },
    {
      label: "Number of kids in this group",
      value: stats?.total_kids ?? "Unavailable",
      icon: "🤦🏼‍♂️",
    },
    {
      label: "Kids Baptised",
      value: stats?.baptised_kids ?? "Unavailable",
      icon: "💧",
    },
    {
      label: "Comes Sunday Service",
      value: stats?.regular_kids ?? "Unavailable",
      icon: "⛪️",
    },
  ];

  return (
    <section className="bg-gray-200 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 md:mb-7 text-blue-900">
        Group Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className="flex items-center p-3 md:p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#E07B13] text-white w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full mr-3 shrink-0">
                  {card.icon}
                </div>

                <div>
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    {card.label}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-[#E07B13]">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
