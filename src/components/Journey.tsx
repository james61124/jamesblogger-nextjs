"use client";

import { motion } from "framer-motion";
import JourneyCard, { JourneyItem } from "./JourneyCard";

const journeyItems: JourneyItem[] = [
  {
    chapter: "Chapter 06 · United States",
    year: "May 2026 – Present",
    place: "Arlington, Virginia, USA",
    title: "Amazon",
    subtitle: "SDE Intern",
    description:
      "My first experience as a software engineer in the United States, building large-scale distributed systems while learning how software is developed and operated at Amazon's scale.",
    image: "/images/amazon.jpg",
    imageAlt: "Amazon office building",
    stamp: "Jul 2026 · USA",
    accent: "blue",
  },
  {
    chapter: "Chapter 05 · United States",
    year: "Aug 2025 – Dec 2026",
    place: "Houston, Texas, USA",
    title: "Rice University",
    subtitle: "Master of Computer Science",
    description:
      "My first time living in the United States. Beyond graduate studies, this chapter has been about adapting to a new culture, making lifelong friends, and pursuing opportunities that eventually led me to Amazon.",
    image: "/images/rice.png",
    imageAlt: "Rice University campus",
    stamp: "Houston · Texas",
    accent: "green",
  },
  {
    chapter: "Chapter 04 · Taiwan",
    year: "Jan 2025 – Aug 2025",
    place: "Taipei, Taiwan",
    title: "Blockchain Security",
    subtitle: "R&D Full-time Software Engineer",
    description:
      "Returned to the team as a full-time engineer, taking ownership of production backend systems, cloud infrastructure, and AI-powered security analysis after my internship.",
    image: "/images/blockchain-2.jpeg",
    imageAlt: "Cybersecurity dashboard",
    accent: "blue",
  },
  {
    chapter: "Chapter 03 · Netherlands",
    year: "Jun 2024 – Dec 2024",
    place: "Veldhoven, Netherlands",
    title: "ASML",
    subtitle: "Software Engineer Intern",
    description:
      "My first experience living abroad. Six unforgettable months in the Netherlands introduced me to European work culture, travel, and a completely different way of life beyond engineering.",
    image: "/images/life/asml/members.JPG",
    imageAlt: "ASML campus in the Netherlands",
    stamp: "Netherlands · 2024",
    accent: "green",
  },
  {
    chapter: "Chapter 02 · Taiwan",
    year: "Jun 2023 – Jun 2024",
    place: "Taipei, Taiwan",
    title: "Blockchain Security",
    subtitle: "R&D Software Engineer Intern",
    description:
      "My first software engineering internship, where I built production Go/Gin backend services, large-scale data pipelines, and an AI-assisted security analysis system that transformed classroom knowledge into real-world engineering.",
    image: "/images/blockchain-1.jpeg",
    imageAlt: "Software monitoring dashboard",
    accent: "blue",
  },
  {
    chapter: "Chapter 01 · Taiwan",
    year: "Sep 2020 – Dec 2024",
    place: "Hsinchu, Taiwan",
    title: "NYCU",
    subtitle: "B.S. in Computer Science",
    description:
      "Where the journey began. It was my first time leaving home, discovering computer science, meeting incredible friends, and building the foundation for everything that came after.",
    image: "/images/nycu.png",
    imageAlt: "National Yang Ming Chiao Tung University campus",
    stamp: "Taiwan · The beginning",
    accent: "green",
  },
];

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative scroll-mt-0 overflow-hidden bg-[#f4efe6] px-5 pb-28 pt-8 sm:px-8 sm:pt-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.13) 0.65px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />

      <header className="relative mx-auto max-w-6xl pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
        {/* <motion.p
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#42679c]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Chapter 01
        </motion.p> */}

        <motion.h2
          className="mt-4 font-serif text-5xl font-normal leading-none tracking-[-0.025em] text-[#28251f] sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7 }}
        >
          My Journey
        </motion.h2>

        <motion.p
          className="mx-auto mt-5 max-w-lg font-serif text-base italic leading-8 text-[#625d54] sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.7 }}
        >
          Every place, every project, and every experience has shaped who I am
          today.
        </motion.p>
      </header>

      <div className="relative">
        {journeyItems.map((item, index) => (
          <JourneyCard
            key={`${item.title}-${item.year}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      <motion.p
        className="relative mx-auto mt-12 max-w-xl text-center font-serif text-base italic tracking-wide text-[#496b9e] sm:text-lg"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        More places. More stories. More to come.
      </motion.p>
    </section>
  );
}
