"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 760], [0, 130]);
  const backgroundScale = useTransform(scrollY, [0, 760], [1, 1.055]);
  const contentOpacity = useTransform(scrollY, [0, 560], [1, 0.08]);
  const contentY = useTransform(scrollY, [0, 560], [0, -52]);

  return (
    <section className="relative min-h-[720px] h-screen w-full overflow-hidden bg-[#151216]">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/Guitar.JPEG')",
          y: backgroundY,
          scale: backgroundScale,
        }}
      />

      <div className="absolute inset-0 bg-black/48" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,18,28,0.20),rgba(4,4,7,0.18)_52%,rgba(2,2,4,0.50))]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_28%,rgba(204,142,159,0.24),transparent_28%),radial-gradient(circle_at_64%_82%,rgba(105,87,166,0.14),transparent_26%)]" />

      <motion.div
        className="relative pt-30 z-10 flex h-full -translate-y-8 flex-col items-center justify-center px-6 text-center sm:-translate-y-10"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 flex w-full max-w-[670px] items-center justify-center gap-6"
        >
          <span className="hidden h-px w-16 bg-white/62 sm:block" />

          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-white/72 sm:text-[11px]">
            A personal collection
          </p>

          <span className="hidden h-px w-16 bg-white/62 sm:block" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.78, ease: "easeOut" }}
          className="
            max-w-[1450px]
            font-extrabold
            leading-[0.93]
            tracking-[-0.025em]
            text-white
            drop-shadow-[0_12px_30px_rgba(0,0,0,0.30)]
            text-[3.25rem]
            sm:text-[4.6rem]
            md:text-[6.3rem]
            lg:text-[7.4rem]
            xl:text-[8rem]
          "
        >
          James Blogger
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.72 }}
          className="mt-8 max-w-2xl font-serif text-[1.15rem] leading-8 text-white/78 sm:text-[1.35rem] sm:leading-9"
        >
          Exploring life, building software, and collecting stories along the
          way.
        </motion.p>

        <Link href="#journey" className="mt-9">
          <motion.span
            whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.985 }}
            className="
              inline-flex h-[56px] items-center gap-3 rounded-full
              border border-white/24 bg-white/[0.055] px-8
              text-[15px] font-medium tracking-[0.01em] text-white/92
              backdrop-blur-md transition-colors duration-300
            "
          >
            Open the journal
            <span aria-hidden className="text-lg leading-none text-white/76">
              ↓
            </span>
          </motion.span>
        </Link>
      </motion.div>

      <Link
        href="#journey"
        aria-label="Scroll to journey"
        className="absolute bottom-9 left-1/2 z-20 -translate-x-1/2 text-white/72"
      >
        <motion.svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{
            y: [0, 8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.25}
            d="m6 9 6 6 6-6"
          />
        </motion.svg>
      </Link>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-72 sm:h-96"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,239,230,0) 0%, rgba(244,239,230,0.04) 24%, rgba(244,239,230,0.16) 46%, rgba(244,239,230,0.46) 70%, rgba(244,239,230,0.82) 88%, #f4efe6 100%)",
        }}
      />
    </section>
  );
}
