import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Site Navigation */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-600 transition">Main</Link></li>
            <li><Link href="/life" className="hover:text-blue-600 transition">Life</Link></li>
            <li><Link href="/travel" className="hover:text-blue-600 transition">Travel</Link></li>
            <li><Link href="/program" className="hover:text-blue-600 transition">Programming</Link></li>
            <li><Link href="/leetcode" className="hover:text-blue-600 transition">Leetcode</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <div className="flex gap-4">
            <a
              href="https://github.com/james61124"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900 hover:scale-110 transition-all duration-300 ease-in-out"
            >
              <FaGithub size={28} />
            </a>

            <a
              href="https://www.linkedin.com/in/hong-jun-chiu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 hover:scale-110 transition-all duration-300 ease-in-out"
            >
              <FaLinkedin size={28} />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100006460037940"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:scale-110 transition-all duration-300 ease-in-out"
            >
              <FaFacebook size={28} />
            </a>

            <a
              href="https://www.instagram.com/james51124/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 hover:scale-110 transition-all duration-300 ease-in-out"
            >
              <FaInstagram size={28} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Copyright</h2>
          <p className="text-sm">© {new Date().getFullYear()} James&apos; Blog. All rights reserved.</p>
          <p className="text-sm mt-2">This website is powered by Next.js & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}