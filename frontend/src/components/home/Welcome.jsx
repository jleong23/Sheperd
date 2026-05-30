import { BsCardChecklist } from "react-icons/bs";
/**
 *
 * Welcome Component + buttons to Attendance / New People Page
 */
export default function Welcome() {
  return (
    <section className="bg-blue-200 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 text-center text-blue-900 shadow-lg">
      {" "}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight drop-shadow leading-tight">
        {" "}
        Welcome to Dreamers Youth
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-5 md:mb-7 leading-relaxed drop-shadow">
        “Do nothing out of selfish ambition or vain conceit. Rather, in humility
        value others above yourselves, not looking to your own interests but
        each of you to the interests of the others.”
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <a
          href="/attendance"
          className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold shadow-md hover:bg-yellow-600 hover:scale-105 transition inline-flex items-center justify-center gap-2"
        >
          <BsCardChecklist className="text-xl md:text-2xl" />
          Attendance
        </a>
        <a
          href="/new-people"
          className="bg-black text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold shadow-lg hover:bg-pink-600 hover:scale-105 transition inline-flex items-center justify-center gap-2"
        >
          <BsCardChecklist className="text-xl md:text-2xl" />
          New People
        </a>
      </div>
    </section>
  );
}
