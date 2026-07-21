"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";

const roadmapData = [
  {
    id: "two-pointers",
    number: "01",
    title: "Two Pointers & Sliding Window",
    description: "Pointer movement, window optimization, and linked-list patterns.",
    items: [
      { id: "two-pointers", title: "[ Algorithm ] Two Pointers | 核心概念與 Leetcode 題型解析", difficulty: "Easy", link: "/program/articles/two-pointers" },
      { id: "sliding-window", title: "[ Algorithm ] Sliding Window | 核心概念與 Leetcode 題型解析", difficulty: "Medium", link: "/program/articles/sliding-Window" },
      { id: "linked-list-two-pointer", title: "[ Algorithm ] Two Pointers - Linked List | 核心概念與 Leetcode 題型解析", difficulty: "Medium", link: "/program/articles/linked-list-two-pointer" },
    ],
  },
  {
    id: "searching-sorting",
    number: "02",
    title: "Searching & Sorting",
    description: "Foundational search strategies and efficient ordering techniques.",
    items: [
      { id: "binary-search", title: "[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析", difficulty: "Easy", link: "/program/articles/binary-search" },
      { id: "quick-select", title: "[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析", difficulty: "Medium", link: "/program/articles/quick-select" },
    ],
  },
  {
    id: "dynamic-programming",
    number: "03",
    title: "Dynamic Programming",
    description: "State design, transitions, memoization, and optimization patterns.",
    items: [
      { id: "dp", title: "[ Algorithm ] Dynamic Programming (一) - Introduction", difficulty: "Medium", link: "/program/articles/dp" },
      { id: "dp-memo", title: "[ Algorithm ] Dynamic Programming (二) - Memorization", difficulty: "Medium", link: "/program/articles/dp-memo" },
      { id: "linear-dp", title: "[ Algorithm ] Dynamic Programming (三) - Linear DP", difficulty: "Medium", link: "/program/articles/linear-dp" },
      { id: "knapsack-problem", title: "[ Algorithm ] Dynamic Programming (四) - Knapsack Problem", difficulty: "Hard", link: "/program/articles/knapsack-problem" },
      { id: "interval-dp", title: "[ Algorithm ] Dynamic Programming (五) - Interval DP", difficulty: "Hard", link: "/program/articles/interval-dp" },
      { id: "digit-dp", title: "[ Algorithm ] Dynamic Programming (六) - Digit DP", difficulty: "Hard", link: "/program/articles/digit-dp" },
      { id: "counting-dp", title: "[ Algorithm ] Dynamic Programming (七) - Counting DP", difficulty: "Medium", link: "/program/articles/counting-dp" },
    ],
  },
  {
    id: "trees",
    number: "04",
    title: "Trees & Binary Search Trees",
    description: "Traversal, reconstruction, and ordered-tree reasoning.",
    items: [
      { id: "binary-tree-traversal", title: "[ Data Structure ] Binary Tree - Traversal", difficulty: "Easy", link: "/program/articles/binary-tree-traversal" },
      { id: "binary-search-tree", title: "[ Data Structure ] Binary Search Tree", difficulty: "Medium", link: "/program/articles/binary-search-tree" },
      { id: "binary-tree-reconstruction", title: "[ Data Structure ] Binary Tree - Reconstruction", difficulty: "Hard", link: "/program/articles/binary-tree-reconstruction" },
    ],
  },
  {
    id: "graphs",
    number: "05",
    title: "Graph Algorithms",
    description: "Traversal, connectivity, ordering, and shortest paths.",
    items: [
      { id: "dfs-bfs", title: "[ Algorithm ] DFS & BFS", difficulty: "Medium", link: "/program/articles/DFS-BFS" },
      { id: "topological-sort", title: "[ Algorithm ] Topological Sort", difficulty: "Medium", link: "/program/articles/topological-sort" },
      { id: "union-find", title: "[ Algorithm ] Union Find", difficulty: "Medium", link: "/program/articles/union-find" },
      { id: "dijkstra", title: "[ Algorithm ] Shortest Path - Dijkstra", difficulty: "Hard", link: "/program/articles/dijkstra" },
      { id: "bellman-ford", title: "[ Algorithm ] Shortest Path - Bellman-Ford", difficulty: "Hard", link: "/program/articles/bellman-ford" },
    ],
  },
  {
    id: "data-structures",
    number: "06",
    title: "Data Structures",
    description: "Core structures that organize, retrieve, and prioritize data.",
    items: [
      { id: "hash-tables", title: "[ Data Structure ] Hash Table", difficulty: "Easy", link: "/program/articles/hash-table" },
      { id: "stack", title: "[ Data Structure ] Stack & Monotonic Stack", difficulty: "Easy", link: "/program/articles/stack" },
      { id: "queue", title: "[ Data Structure ] Queue & Priority Queue", difficulty: "Easy", link: "/program/articles/queue" },
    ],
  },
  {
    id: "advanced-algorithms",
    number: "07",
    title: "Advanced Algorithms",
    description: "Higher-level strategies for complex problem solving.",
    items: [
      { id: "backtracking", title: "[ Algorithm ] Backtracking", difficulty: "Medium", link: "/program/articles/backtracking" },
      { id: "greedy", title: "[ Algorithm ] Greedy", difficulty: "Medium", link: "/program/articles/Greedy" },
      { id: "manacher", title: "[ Algorithm ] Manacher's Algorithm", difficulty: "Hard", link: "/program/articles/manacher" },
      { id: "kmp", title: "[ Algorithm ] KMP Algorithm", difficulty: "Hard", link: "/program/articles/kmp" },
    ],
  },
];

const difficultyClass = {
  Easy: "text-[#3c7b5c]",
  Medium: "text-[#9a6a2c]",
  Hard: "text-[#9b4d43]",
};

export default function TopicRoadmap() {
  const [expanded, setExpanded] = useState(new Set(["two-pointers", "searching-sorting"]));

  const toggleSection = (id) => {
    setExpanded((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe6] px-5 pb-28 pt-32 sm:px-8 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.12) 0.65px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <header className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#857968]">
            Table of contents
          </p>
          <h1 className="mt-5 font-serif text-5xl font-normal tracking-[-0.03em] text-[#29251f] sm:text-6xl">
            Leetcode Roadmap
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-8 text-[#6d655b]">
            A structured collection of patterns, techniques, and notes for
            solving algorithm problems with intention.
          </p>
        </header>

        <section className="border-t border-[#756c60]/16">
          {roadmapData.map((section) => {
            const isExpanded = expanded.has(section.id);

            return (
              <article
                key={section.id}
                className="border-b border-[#756c60]/16"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="group grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-start gap-5 py-8 text-left sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:gap-7 sm:py-10"
                >
                  <span className="pt-1 font-mono text-[11px] tracking-[0.16em] text-[#9a8f80]">
                    {section.number}
                  </span>

                  <span>
                    <span className="block font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2d2924] transition-colors group-hover:text-[#456b9b] sm:text-[2.35rem]">
                      {section.title}
                    </span>
                    <span className="mt-3 block max-w-2xl font-serif text-[15px] leading-7 text-[#70685d]">
                      {section.description}
                    </span>
                    <span className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7e7468]">
                      {section.items.length} articles
                    </span>
                  </span>

                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#756c60]/18 text-[#6b6359]"
                  >
                    <ChevronDown size={17} strokeWidth={1.6} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-[76px] sm:pb-10 sm:pl-[99px]">
                        <div className="border-l border-[#756c60]/16 pl-5 sm:pl-7">
                          {section.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.link}
                              className="group flex items-center justify-between gap-6 border-b border-[#756c60]/10 py-4 last:border-b-0"
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-serif text-[1.05rem] leading-7 text-[#3d3831] transition-colors group-hover:text-[#456b9b]">
                                  {item.title}
                                </span>
                                <span
                                  className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] ${difficultyClass[item.difficulty]}`}
                                >
                                  {item.difficulty}
                                </span>
                              </span>

                              <ArrowUpRight
                                size={17}
                                strokeWidth={1.5}
                                className="shrink-0 text-[#8b8174] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
