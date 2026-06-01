import { FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

export default function KidPhones({ phone, parentPhone }) {
  const phoneItems = [
    {
      label: "Kid",
      value: phone,
      href: phone ? `tel:${phone}` : undefined,
      icon: <FaPhoneAlt size={12} />,
      iconStyle: "bg-purple-500/20 text-purple-300",
      hoverStyle: "hover:text-purple-300",
    },
    {
      label: "Parent",
      value: parentPhone,
      href: parentPhone ? `tel:${parentPhone}` : undefined,
      icon: <MdContactPhone size={14} />,
      iconStyle: "bg-indigo-500/20 text-indigo-300",
      hoverStyle: "hover:text-indigo-300",
    },
  ];

  return (
    <div className="mt-auto w-full border-t border-slate-800 pt-4">
      <div className="grid gap-3">
        {phoneItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3 transition hover:border-indigo-500/50 hover:bg-slate-900/80"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
            >
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </span>

              {item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => e.stopPropagation()}
                  className={`block truncate text-sm font-semibold text-slate-300 transition ${item.hoverStyle}`}
                >
                  {item.value}
                </a>
              ) : (
                <span className="block text-sm font-semibold text-slate-500">
                  N/A
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
