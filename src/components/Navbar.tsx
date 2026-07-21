// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X, ChevronDown } from "lucide-react";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
//   const controls = useAnimationControls();
//   const pathname = usePathname();
//   const dropdownRef = useRef(null);

//   // 是否在首頁
//   const isHome = pathname === "/";

//   // 監聽滾動事件，切換 Navbar 狀態
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 點擊外部關閉下拉選單
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsProgramDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 控制手機選單的動畫
//   const toggleMenu = () => {
//     setIsOpen(prev => !prev);
//     controls.start({ opacity: isOpen ? 0 : 1, x: isOpen ? 50 : 0 });
//   };

//   // 根據是否滾動 + 是否為首頁 決定 Navbar 顏色
//   const navTextColor = isScrolled || !isHome ? "text-gray-900" : "text-white";
//   const hoverTextColor = isScrolled || !isHome ? "hover:text-black" : "hover:text-gray-300";

//   const navLinks = [
//     {
//       label: "Life",
//       path: {
//         pathname: "/life",
//       },
//     },
//     {
//       label: "Travel",
//       path: {
//         pathname: "/travel",
//       },
//     },
//     {
//       label: "Program",
//       path: null, // 這個有下拉選單，所以不直接導航
//       hasDropdown: true,
//       dropdownItems: [
//         {
//           label: "Leetcode Roadmap",
//           path: {
//             pathname: "/leetcode-roadmap",
//           },
//         },
//         {
//           label: "Others",
//           path: {
//             pathname: "/other",
//           },
//         },
//       ],
//     },
//     {
//       label: "Leetcode",
//       path: {
//         pathname: "/leetcode",
//       },
//     },
//   ];

//   // 檢查是否為 Program 相關頁面
//   const isProgramActive = pathname.startsWith("/program");

//   return (
//     <motion.nav
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//         isScrolled || !isHome ? "bg-white shadow-md h-16" : "bg-transparent h-20"
//       }`}
//     >
//       <div className="container mx-auto flex items-center justify-between px-6 py-4">
//         {/* Logo 區域 */}
//         <Link href="/" className={`text-2xl font-bold ${navTextColor}`}>
//           James Blogger
//         </Link>

//         {/* Desktop 導航連結 */}
//         <div className="hidden md:flex space-x-8">
//           {navLinks.map((link, index) => {
//             if (link.hasDropdown) {
//               return (
//                 <div key={index} className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
//                     className={`flex items-center space-x-1 cursor-pointer transition-colors duration-300 ${navTextColor} ${hoverTextColor} ${
//                       isProgramActive ? 'text-blue-600' : ''
//                     }`}
//                   >
//                     <span>{link.label}</span>
//                     <motion.div
//                       animate={{ rotate: isProgramDropdownOpen ? 180 : 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <ChevronDown size={16} />
//                     </motion.div>
//                   </button>

//                   {/* 下拉選單 */}
//                   <AnimatePresence>
//                     {isProgramDropdownOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
//                       >
//                         {link.dropdownItems.map((item, itemIndex) => (
//                           <Link
//                             key={itemIndex}
//                             href={item.path}
//                             className={`block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
//                               pathname === item.path.pathname ? 'bg-blue-50 text-blue-600' : ''
//                             }`}
//                             onClick={() => setIsProgramDropdownOpen(false)}
//                           >
//                             {item.label}
//                           </Link>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             }

//             return (
//               <motion.div key={index} whileHover={{ scale: 1.1 }}>
//                 <Link
//                   href={link.path}
//                   className={`relative transition-colors duration-300 ${navTextColor} ${hoverTextColor} ${
//                     pathname === link.path.pathname ? 'text-blue-600' : ''
//                   }`}
//                 >
//                   {link.label}
//                   <motion.span
//                     className="absolute left-0 bottom-0 w-full h-0.5 bg-current"
//                     initial={{ scaleX: 0 }}
//                     whileHover={{ scaleX: 1 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* 行動裝置漢堡按鈕 */}
//         <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMenu}>
//           <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </motion.div>
//         </button>

//         {/* 行動選單 */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="absolute top-16 left-0 w-full bg-[rgba(30,30,30,0.85)] backdrop-blur-lg md:hidden transition-all"
//           >
//             <ul className="flex flex-col items-center py-6 space-y-6">
//               {navLinks.map((link, index) => {
//                 if (link.hasDropdown) {
//                   return (
//                     <div key={index} className="w-full">
//                       <div className="text-center text-[#EDE9E3] text-xl font-medium mb-2">
//                         {link.label}
//                       </div>
//                       {link.dropdownItems.map((item, itemIndex) => (
//                         <motion.li key={itemIndex} whileHover={{ scale: 1.05 }} className="w-full">
//                           <Link
//                             href={item.path}
//                             className="block text-[#C0B9A8] text-lg px-6 py-2 text-center hover:text-[#EDE9E3] transition-all"
//                             onClick={() => setIsOpen(false)}
//                           >
//                             • {item.label}
//                           </Link>
//                         </motion.li>
//                       ))}
//                     </div>
//                   );
//                 }

//                 return (
//                   <motion.li key={index} whileHover={{ scale: 1.05 }}>
//                     <Link
//                       href={link.path}
//                       className="text-[#EDE9E3] text-xl px-6 py-3 rounded-lg hover:text-[#C0B9A8] transition-all"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       {link.label}
//                     </Link>
//                   </motion.li>
//                 );
//               })}
//             </ul>
//           </motion.div>
//         )}
//       </div>
//     </motion.nav>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

type NavPath = {
  pathname: string;
};

type DropdownItem = {
  label: string;
  description: string;
  path: NavPath;
};

type NavLink = {
  label: string;
  path: NavPath | null;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
};

const navLinks: NavLink[] = [
  {
    label: "Life",
    path: { pathname: "/life" },
  },
  {
    label: "Travel",
    path: { pathname: "/travel" },
  },
  {
    label: "Program",
    path: null,
    hasDropdown: true,
    dropdownItems: [
      {
        label: "Leetcode Roadmap",
        description: "Structured notes and practice progress.",
        path: { pathname: "/leetcode-roadmap" },
      },
      {
        label: "Others",
        description: "Experiments, builds, and technical notes.",
        path: { pathname: "/other" },
      },
    ],
  },
  {
    label: "Leetcode",
    path: { pathname: "/leetcode" },
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const isHome = pathname === "/";
  const hasSolidBackground = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProjectsOpen(false);
  }, [pathname]);

  const isProjectsActive =
    pathname.startsWith("/leetcode-roadmap") ||
    pathname.startsWith("/other") ||
    pathname.startsWith("/program");

  const textColor = hasSolidBackground
    ? "text-[#29251f]"
    : "text-white";

  const mutedTextColor = hasSolidBackground
    ? "text-[#29251f]/72 hover:text-[#29251f]"
    : "text-white/76 hover:text-white";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={[
        "fixed inset-x-0 top-0 z-50 w-full",
        "transition-[height,background-color,border-color,backdrop-filter]",
        "duration-500 ease-out",
        hasSolidBackground
          ? "h-[72px] border-b border-black/[0.06] bg-[#fffdf8]/82 backdrop-blur-2xl"
          : "h-[78px] border-b border-white/10 bg-black/[0.06] backdrop-blur-[2px]",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="James Blogger homepage"
          className={[
            "relative z-50 inline-flex items-baseline",
            "transition-opacity duration-300 hover:opacity-80",
            textColor,
          ].join(" ")}
        >
          <span className="font-serif text-[1.65rem] leading-none tracking-[-0.02em] sm:text-[1.8rem]">
            James Blogger
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex lg:gap-12">
          {navLinks.map((link) => {
            if (link.hasDropdown && link.dropdownItems) {
              return (
                <div key={link.label} ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProjectsOpen((value) => !value)}
                    aria-expanded={isProjectsOpen}
                    className={[
                      "group relative flex items-center gap-1.5",
                      "text-[15px] font-medium tracking-[0.025em]",
                      "transition-colors duration-300",
                      isProjectsActive ? textColor : mutedTextColor,
                    ].join(" ")}
                  >
                    <span>{link.label}</span>

                    <motion.span
                      animate={{ rotate: isProjectsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <ChevronDown size={15} strokeWidth={1.7} />
                    </motion.span>

                    <span
                      className={[
                        "absolute -bottom-2 left-0 h-px w-full origin-left",
                        "bg-current transition-transform duration-300",
                        isProjectsActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      ].join(" ")}
                    />
                  </button>

                  <AnimatePresence>
                    {isProjectsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.985 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={[
                          "absolute right-0 top-full mt-5 w-[310px]",
                          "overflow-hidden rounded-2xl border border-black/[0.06]",
                          "bg-[#fffdf8]/95 p-2 backdrop-blur-2xl",
                          "shadow-[0_18px_60px_rgba(32,25,16,0.14)]",
                        ].join(" ")}
                      >
                        {link.dropdownItems.map((item) => {
                          const active = pathname === item.path.pathname;

                          return (
                            <Link
                              key={item.label}
                              href={item.path}
                              className={[
                                "group block rounded-xl px-4 py-3.5",
                                "transition-colors duration-200",
                                active
                                  ? "bg-black/[0.045]"
                                  : "hover:bg-black/[0.035]",
                              ].join(" ")}
                            >
                              <span className="block text-[14px] font-semibold tracking-[0.01em] text-[#29251f]">
                                {item.label}
                              </span>
                              <span className="mt-1 block text-[12px] leading-5 text-[#6f675d]">
                                {item.description}
                              </span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            if (!link.path) return null;

            const active = pathname === link.path.pathname;

            return (
              <Link
                key={link.label}
                href={link.path}
                className={[
                  "group relative text-[15px] font-medium tracking-[0.025em]",
                  "transition-colors duration-300",
                  active ? textColor : mutedTextColor,
                ].join(" ")}
              >
                {link.label}

                <span
                  className={[
                    "absolute -bottom-2 left-0 h-px w-full origin-left",
                    "bg-current transition-transform duration-300",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
          className={[
            "relative z-50 inline-flex h-10 w-10 items-center justify-center",
            "rounded-full border transition-colors duration-300 md:hidden",
            hasSolidBackground
              ? "border-black/10 bg-black/[0.025] text-[#29251f]"
              : "border-white/15 bg-white/[0.06] text-white",
          ].join(" ")}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "menu"}
              initial={{ opacity: 0, rotate: -16, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 16, scale: 0.9 }}
              transition={{ duration: 0.16 }}
              className="inline-flex"
            >
              {isOpen ? (
                <X size={20} strokeWidth={1.7} />
              ) : (
                <Menu size={21} strokeWidth={1.7} />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-black/[0.06] bg-[#f7f1e7]/97 px-6 pb-8 pt-5 shadow-[0_18px_50px_rgba(32,25,16,0.12)] backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto max-w-lg">
              {navLinks.map((link) => {
                if (link.hasDropdown && link.dropdownItems) {
                  return (
                    <div
                      key={link.label}
                      className="border-b border-black/[0.07] py-4"
                    >
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7f70]">
                        {link.label}
                      </p>

                      <div className="space-y-1">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.path}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.035]"
                          >
                            <span className="block font-serif text-[1.35rem] leading-tight text-[#29251f]">
                              {item.label}
                            </span>
                            <span className="mt-1 block text-[12px] leading-5 text-[#746b60]">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (!link.path) return null;

                return (
                  <Link
                    key={link.label}
                    href={link.path}
                    className="flex items-center justify-between border-b border-black/[0.07] px-1 py-4 font-serif text-[1.65rem] text-[#29251f]"
                  >
                    <span>{link.label}</span>
                    <span className="text-base text-[#8a7f70]">↗</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
