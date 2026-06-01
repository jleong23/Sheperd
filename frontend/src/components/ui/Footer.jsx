import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaGlobe } from "react-icons/fa";

export default function Footer() {
  const socials = [
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/dreamers.yth/",
    },
    {
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/dreamers.yth/",
    },
    {
      icon: <FaGlobe />,
      href: "https://australia.influencers.church/programs/",
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Dreamers{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Youth
              </span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Building young people who know God, love people, and influence
              their world.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -3,
                    scale: 1.08,
                    boxShadow: "0px 0px 20px rgba(99,102,241,0.35)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Campuses */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Campuses</h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>Adelaide City Campus</li>
              <li>Western Suburbs Campus</li>
              <li>North East Campus</li>
              <li>Southern Hills Campus</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>

            <div className="space-y-3 text-sm text-slate-400">
              <p>Jason Leong</p>
              <p>+61 xxx xxx xxx</p>
              <p>info@futures.church</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500">
            © 2026 Dreamers Youth AU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
