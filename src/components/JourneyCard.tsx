"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type JourneyItem = {
  chapter: string;
  year: string;
  place: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  stamp?: string;
  accent: "blue" | "green";
};

type JourneyCardProps = {
  item: JourneyItem;
  index: number;
};

const accentStyles = {
  blue: {
    dot: "bg-[#315f9f]",
    text: "text-[#315f9f]",
    ring: "ring-[#315f9f]/15",
  },
  green: {
    dot: "bg-[#2c8a64]",
    text: "text-[#2c8a64]",
    ring: "ring-[#2c8a64]/15",
  },
};

export default function JourneyCard({
  item,
  index,
}: JourneyCardProps) {
  const reverse = index % 2 === 1;
  const accent = accentStyles[item.accent];
  const rotation = reverse ? 1.5 : -1.5;

  return (
    <article className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 py-14 md:grid-cols-[150px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[170px_minmax(0,1fr)] lg:py-16">
      <aside className="relative hidden h-full opacity-65 md:block">
        <div className="absolute left-5 top-0 h-[calc(100%+8rem)] border-l border-dashed border-[#766f63]/25" />

        <div className="sticky top-28 space-y-5 pl-10">
          <div className="relative">
            <span
              className={`absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full ${accent.dot} ring-4 ${accent.ring}`}
            />
            <p className="font-serif text-sm italic leading-6 text-[#6e675d]">
              {item.year}
            </p>
          </div>

          <div className="relative">
            <span
              className="absolute -left-[32px] top-0.5 text-sm text-[#3f3b35]"
              aria-hidden
            >
              ●
            </span>
            <p className="max-w-[130px] font-serif text-sm italic leading-6 text-[#6e675d]">
              {item.place}
            </p>
          </div>
        </div>
      </aside>

      <motion.div
        className="relative grid grid-cols-1 items-center gap-10 rounded-[2px] bg-[#fffdf8]/75 px-6 py-10 shadow-[0_12px_30px_rgba(75,61,40,0.09)] ring-1 ring-black/[0.025] sm:px-9 sm:py-11 md:grid-cols-2 md:gap-14 md:px-12 md:py-12 lg:px-14 lg:py-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          className={`relative ${reverse ? "md:order-2" : ""}`}
          initial={{ opacity: 0, x: reverse ? 28 : -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          <motion.div
            className="relative bg-white p-3 pb-9 shadow-[0_10px_22px_rgba(56,45,30,0.13)]"
            style={{ rotate: rotation }}
            whileHover={{ rotate: 0, scale: 1.018 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 19,
            }}
          >
            {index % 2 === 0 ? (
              <span className="absolute -top-3 left-1/2 z-20 h-5 w-5 -translate-x-1/2 rounded-full bg-[#b4883d] shadow-[0_3px_6px_rgba(0,0,0,0.22)]" />
            ) : (
              <span className="absolute -right-2 -top-2 z-20 h-8 w-24 rotate-[7deg] bg-[#ddcfae]/65 shadow-[0_2px_4px_rgba(0,0,0,0.06)]" />
            )}

            <div className="relative bg-[#d7d1c4]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                width={1600}
                height={1200}
                className="w-full h-auto"
              />
            </div>

            <p className="absolute bottom-2 left-4 font-serif text-xs italic tracking-wide text-[#777064]">
              {item.place}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className={reverse ? "md:order-1" : ""}
          initial={{ opacity: 0, x: reverse ? -22 : 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.16 }}
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
            {item.chapter}
          </p>

          <h3 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-[#28251f] sm:text-[2.75rem] lg:text-5xl">
            {item.title}
          </h3>

          <p className={`mt-4 font-serif text-lg font-semibold leading-7 ${accent.text}`}>
            {item.subtitle}
          </p>

          <p className="mt-6 max-w-xl font-serif text-base leading-8 text-[#625c53]">
            {item.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 md:hidden">
            <span className="rounded-full border border-[#8b8375]/25 px-3 py-1 font-serif text-sm italic text-[#696257]">
              {item.year}
            </span>
            <span className="font-serif text-sm italic text-[#696257]">
              {item.place}
            </span>
          </div>

          {item.stamp && (
            <div className="mt-8 inline-flex rotate-[-4deg] items-center border border-[#5674a1]/25 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#5674a1]/50">
              {item.stamp}
            </div>
          )}
        </motion.div>
      </motion.div>
    </article>
  );
}
