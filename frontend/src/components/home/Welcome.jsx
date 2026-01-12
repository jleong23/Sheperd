import { BsCardChecklist } from "react-icons/bs";
/**
 *
 * Welcome Component + buttons to Attendance / New People Page
 */
export default function Welcome() {
  return (
    <section className="bg-blue-200 rounded-xl p-14 text-center text-blue-900 shadow-xl transform transition duration-500 hover:scale-[1.02]">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
        Welcome to Dreamers Youth
      </h1>
      <p className="text-2xl max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow">
        “Do nothing out of selfish ambition or vain conceit. Rather, in humility
        value others above yourselves, not looking to your own interests but
        each of you to the interests of the others.”
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
  );
}
