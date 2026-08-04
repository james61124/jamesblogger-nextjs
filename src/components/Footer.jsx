// import Link from "next/link";
// import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-12">
//       <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
//         {/* Site Navigation */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
//           <ul className="space-y-2">
//             <li><Link href="/" className="hover:text-blue-600 transition">Main</Link></li>
//             <li>
//               <Link 
//                 href={{
//                   pathname: "/life",
//                   query: {
//                     json_path: "/metadata/life_metadata.json",
//                     title: "Life Journal",
//                     category: "life"
//                   },
//                 }} 
//                 className="hover:text-blue-600 transition">
//                   Life
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 href={{
//                   pathname: "/travel",
//                   query: {
//                     json_path: "/metadata/travel_metadata.json",
//                     title: "Journey Memories",
//                     category: "travel"
//                   },
//                 }} 
//                 className="hover:text-blue-600 transition">
//                   Travel
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 href={{
//                   pathname: "/program",
//                   query: {
//                     json_path: "/metadata/program_metadata.json",
//                     title: "Program Notes",
//                     category: "program"
//                   },
//                 }} 
//                 className="hover:text-blue-600 transition">
//                   Program
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 href={{
//                   pathname: "/leetcode",
//                   query: {
//                     json_path: "/metadata/leetcode_metadata.json",
//                     title: "Leetcoce Notes",
//                     category: "leetcode"
//                   },
//                 }} 
//                 className="hover:text-blue-600 transition">
//                   Leetcode
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Social Media */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Social Media</h2>
//           <div className="flex gap-4">
//             <a
//               href="https://github.com/james61124"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-800 hover:text-gray-900 hover:scale-110 transition-all duration-300 ease-in-out"
//             >
//               <FaGithub size={28} />
//             </a>

//             <a
//               href="https://www.linkedin.com/in/hong-jun-chiu/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-700 hover:text-blue-800 hover:scale-110 transition-all duration-300 ease-in-out"
//             >
//               <FaLinkedin size={28} />
//             </a>

//             <a
//               href="https://www.facebook.com/profile.php?id=100006460037940"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-700 hover:scale-110 transition-all duration-300 ease-in-out"
//             >
//               <FaFacebook size={28} />
//             </a>

//             <a
//               href="https://www.instagram.com/james51124/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-pink-500 hover:text-pink-600 hover:scale-110 transition-all duration-300 ease-in-out"
//             >
//               <FaInstagram size={28} />
//             </a>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Copyright</h2>
//           <p className="text-sm">© {new Date().getFullYear()} James&apos; Blog. All rights reserved.</p>
//           <p className="text-sm mt-2">This website is powered by Next.js & Tailwind CSS.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Life", href: "/life" },
  { label: "Travel", href: "/travel" }
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/james61124",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hong-jun-chiu/",
    icon: FaLinkedinIn,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100006460037940",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/james51124/",
    icon: FaInstagram,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#eee4d6] text-[#302b25]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.13) 0.65px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-24 sm:px-8 sm:pt-28 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#847766]">
            The journey continues
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
            Thanks for stopping by.
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic leading-8 text-[#665e54]">
            Every place tells a story. Thanks for taking the time to read mine.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#61584d]/16 bg-white/20 text-[#61584d] transition-all duration-300 hover:-translate-y-1 hover:border-[#302b25]/28 hover:bg-white/45 hover:text-[#302b25]"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-[#5f564b]/14 pt-9">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <Link
              href="/"
              className="text-center transition-opacity hover:opacity-70 lg:text-left"
            >
              <span className="block font-serif text-[1.8rem] leading-none tracking-[-0.02em]">
                James Blogger
              </span>
              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a7e6e]">
                Personal Journal
              </span>
            </Link>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
            >
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative text-[13px] font-medium tracking-[0.035em] text-[#5f574d] transition-colors hover:text-[#302b25]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="text-center text-[12px] leading-6 text-[#796f62] lg:text-right">
              <p>© {new Date().getFullYear()} James Blogger</p>
              <p>Designed &amp; built by James.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
