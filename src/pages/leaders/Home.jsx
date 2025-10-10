import { BsCardChecklist } from "react-icons/bs";
import { IoCheckboxOutline } from "react-icons/io5";

export default function Home() {
  return (
    <div className="p-8 space-y-16 max-w-7xl mx-auto">
      {/* Attendance + New People checklist */}
      <section className="bg-blue-200 rounded-xl p-14 text-center text-blue-900 shadow-xl transform transition duration-500 hover:scale-[1.02]">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Welcome to Dreamers Youth
        </h1>
        <p className="text-2xl max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow">
          “Do nothing out of selfish ambition or vain conceit. Rather, in
          humility value others above yourselves, not looking to your own
          interests but each of you to the interests of the others.”
        </p>
        <div className="inline-flex flex-wrap justify-center gap-8">
          <a
            href="/attendance"
            className="bg-black text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-yellow-600 hover:scale-105 transform transition"
          >
            <BsCardChecklist className="inline mr-2 text-2xl" /> Attendance
          </a>
          <a
            href="/new-people"
            className="bg-black text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-pink-600 hover:scale-105 transform transition"
          >
            <BsCardChecklist className="inline mr-2 text-2xl" /> New People
          </a>
        </div>
      </section>

      {/* Leader Stats */}
      <section className="bg-gray-200 p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-10 text-blue-900">
          Leader Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Level */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              🏫
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">Year Level</p>
              <p className="text-3xl font-bold text-[#E07B13]">9</p>
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
              <p className="text-3xl font-bold text-[#E07B13]">13</p>
            </div>
          </div>

          {/* Kids Baptised */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              💧
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">Kids Baptised</p>
              <p className="text-3xl font-bold text-[#E07B13]">12</p>
            </div>
          </div>

          {/* Comes Sunday Service */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              ⛪️
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">
                Comes Sunday Service
              </p>
              <p className="text-3xl font-bold text-[#E07B13]">5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            title: "Dreamers Got Talent",
            date: "28/9/2025",
            desc: "Showcase your skills and creativity! Dreamers Got Talent is a fun-filled event where youth can perform, inspire, and celebrate each other’s talents.",
          },
          {
            title: "Youth Alive Conference",
            date: "28/9/2025",
            desc: "Join us for an engaging conference designed to empower and inspire youth through dynamic workshops, worship sessions, and interactive activities.",
          },
          {
            title: "Boys Overnight Sleepovers",
            date: "28/9/2025",
            desc: "Experience adventure and fellowship with overnight activities, games, and bonding experiences designed specifically for boys in a safe and fun environment.",
          },
          {
            title: "Dream Team",
            date: "28/9/2025",
            desc: "Experience adventure and fellowship with overnight activities, games, and bonding experiences designed specifically for boys in a safe and fun environment.",
          },
          {
            title: "Term Planning",
            date: "28/9/2025",
            desc: "Experience adventure and fellowship with overnight activities, games, and bonding experiences designed specifically for boys in a safe and fun environment.",
          },
        ].map(({ title, date, desc }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-8 border text-center hover:shadow-2xl transition cursor-pointer"
          >
            <h2 className="font-extrabold text-3xl text-blue-900 mb-3">
              {title}
            </h2>
            <p className="text-muted text-lg mb-3">{date}</p>
            <p className="text-gray-700 text-xl">{desc}</p>
          </div>
        ))}
      </section>

      {/* Reminders */}
      <section className="bg-blue-900 text-white p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-10">Reminders</h2>
        {[
          {
            title: "Send in attendance by 9pm Friday",
          },
          {
            title: "Tell Ryan he's handsome",
          },
          {
            title: "Update Pastoral Care Logs",
          },
        ].map(({ title }, id) => (
          <div key={id} className="text-2xl flex gap-3 text-center">
            <IoCheckboxOutline />
            {title}
          </div>
        ))}
        <div></div>
      </section>
    </div>
  );
}
