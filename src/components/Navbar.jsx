// "use client";

// import { useState, useEffect } from "react";
// import { motion, useAnimationControls } from "framer-motion";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const controls = useAnimationControls();
//   const pathname = usePathname(); // Next.js 獲取當前路由

//   // 是否在首頁
//   const isHome = pathname === "/";

//   // 監聽滾動事件，切換 Navbar 狀態
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 控制手機選單的動畫
//   const toggleMenu = () => {
//     setIsOpen(prev => !prev); // ✅ 確保狀態正確更新
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
//       path: {
//         pathname: "/program",
//       },
//     },
//     {
//       label: "Leetcode",
//       path: {
//         pathname: "/leetcode",
//       },
//     },
//   ];

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
//           {navLinks.map((link, index) => (
//             <motion.div key={index} whileHover={{ scale: 1.1 }}>
//               <Link
//                 href={link.path}
//                 className={`relative transition-colors duration-300 ${navTextColor} ${hoverTextColor}`}
//               >
//                 {link.label}
//                 <motion.span
//                   className="absolute left-0 bottom-0 w-full h-0.5 bg-current"
//                   initial={{ scaleX: 0 }}
//                   whileHover={{ scaleX: 1 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </Link>
//             </motion.div>
//           ))}
//         </div>

//         {/* 行動裝置漢堡按鈕 */}
//         <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMenu}>
//           <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </motion.div>
//         </button>

//         {/* 行動選單 */}
//         {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//           className="absolute top-16 left-0 w-full bg-[rgba(30,30,30,0.85)] backdrop-blur-lg md:hidden transition-all"
//         >
//           <ul className="flex flex-col items-center py-6 space-y-6">
//             {navLinks.map((link, index) => (
//               <motion.li key={index} whileHover={{ scale: 1.05 }}>
//                 <Link
//                   href={link.path}
//                   className="text-[#EDE9E3] text-xl px-6 py-3 rounded-lg hover:text-[#C0B9A8] transition-all"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               </motion.li>
//             ))}
//           </ul>
//         </motion.div>
//       )}
//       </div>
//     </motion.nav>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const controls = useAnimationControls();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // 是否在首頁
  const isHome = pathname === "/";

  // 監聽滾動事件，切換 Navbar 狀態
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProgramDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 控制手機選單的動畫
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    controls.start({ opacity: isOpen ? 0 : 1, x: isOpen ? 50 : 0 });
  };

  // 根據是否滾動 + 是否為首頁 決定 Navbar 顏色
  const navTextColor = isScrolled || !isHome ? "text-gray-900" : "text-white";
  const hoverTextColor = isScrolled || !isHome ? "hover:text-black" : "hover:text-gray-300";

  const navLinks = [
    {
      label: "Life",
      path: {
        pathname: "/life",
      },
    },
    {
      label: "Travel",
      path: {
        pathname: "/travel",
      },
    },
    {
      label: "Program",
      path: null, // 這個有下拉選單，所以不直接導航
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Leetcode Roadmap",
          path: {
            pathname: "/leetcode-roadmap",
          },
        },
        {
          label: "Others",
          path: {
            pathname: "/other",
          },
        },
      ],
    },
    {
      label: "Leetcode",
      path: {
        pathname: "/leetcode",
      },
    },
  ];

  // 檢查是否為 Program 相關頁面
  const isProgramActive = pathname.startsWith("/program");

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome ? "bg-white shadow-md h-16" : "bg-transparent h-20"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo 區域 */}
        <Link href="/" className={`text-2xl font-bold ${navTextColor}`}>
          James Blogger
        </Link>

        {/* Desktop 導航連結 */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link, index) => {
            if (link.hasDropdown) {
              return (
                <div key={index} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                    className={`flex items-center space-x-1 cursor-pointer transition-colors duration-300 ${navTextColor} ${hoverTextColor} ${
                      isProgramActive ? 'text-blue-600' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    <motion.div
                      animate={{ rotate: isProgramDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  {/* 下拉選單 */}
                  <AnimatePresence>
                    {isProgramDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      >
                        {link.dropdownItems.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.path}
                            className={`block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                              pathname === item.path.pathname ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                            onClick={() => setIsProgramDropdownOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <motion.div key={index} whileHover={{ scale: 1.1 }}>
                <Link
                  href={link.path}
                  className={`relative transition-colors duration-300 ${navTextColor} ${hoverTextColor} ${
                    pathname === link.path.pathname ? 'text-blue-600' : ''
                  }`}
                >
                  {link.label}
                  <motion.span
                    className="absolute left-0 bottom-0 w-full h-0.5 bg-current"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* 行動裝置漢堡按鈕 */}
        <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMenu}>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.div>
        </button>

        {/* 行動選單 */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-16 left-0 w-full bg-[rgba(30,30,30,0.85)] backdrop-blur-lg md:hidden transition-all"
          >
            <ul className="flex flex-col items-center py-6 space-y-6">
              {navLinks.map((link, index) => {
                if (link.hasDropdown) {
                  return (
                    <div key={index} className="w-full">
                      <div className="text-center text-[#EDE9E3] text-xl font-medium mb-2">
                        {link.label}
                      </div>
                      {link.dropdownItems.map((item, itemIndex) => (
                        <motion.li key={itemIndex} whileHover={{ scale: 1.05 }} className="w-full">
                          <Link
                            href={item.path}
                            className="block text-[#C0B9A8] text-lg px-6 py-2 text-center hover:text-[#EDE9E3] transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            • {item.label}
                          </Link>
                        </motion.li>
                      ))}
                    </div>
                  );
                }

                return (
                  <motion.li key={index} whileHover={{ scale: 1.05 }}>
                    <Link
                      href={link.path}
                      className="text-[#EDE9E3] text-xl px-6 py-3 rounded-lg hover:text-[#C0B9A8] transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
