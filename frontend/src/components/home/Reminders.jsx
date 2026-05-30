import { IoCheckboxOutline } from "react-icons/io5";

export default function Reminders() {
  return (
    <section className="bg-blue-900 text-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 md:mb-7">
        Reminders
      </h2>

      {[
        "Send in attendance by 9pm Friday",
        "Tell Ryan he's handsome",
        "Update Pastoral Care Logs",
      ].map((title, id) => (
        <div
          key={id}
          className="text-sm sm:text-base md:text-lg flex items-start gap-3 mb-3"
        >
          <IoCheckboxOutline className="mt-1 shrink-0" />
          <span>{title}</span>
        </div>
      ))}
    </section>
  );
}
