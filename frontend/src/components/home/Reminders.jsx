import { IoCheckboxOutline } from "react-icons/io5";
export default function Reminders() {
  return (
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
    </section>
  );
}
