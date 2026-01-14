import { FaInstagram, FaFacebook, FaHome } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Media */}
          <div>
            <h2 className="font-semibold mb-3">Social Media</h2>
            <div className="flex gap-4 text-xl text-gray-600">
              <a
                href="https://www.instagram.com/dreamers.yth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/dreamers.yth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaFacebook />
              </a>

              <a
                href="https://australia.influencers.church/programs/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                <FaHome />
              </a>
            </div>
          </div>

          {/* Campuses */}
          <div>
            <h2 className="font-semibold mb-3">Campuses</h2>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>Adelaide City Campus</li>
              <li>Western Suburbs Campus</li>
              <li>North East Campus</li>
              <li>Southern Hills Campus</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-3">Contact</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Jason Leong</p>
              <p>Phone: +61 xxx xxx xxx</p>
              <p>Email: info@futures.church</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm mt-10">
          © 2026 Dreamers Youth AU · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
