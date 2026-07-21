"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, X } from "lucide-react";

const difficultyStyles = {
  Easy: "border-[#3c7b5c]/20 bg-[#3c7b5c]/7 text-[#3c7b5c]",
  Medium: "border-[#9a6a2c]/20 bg-[#9a6a2c]/7 text-[#9a6a2c]",
  Hard: "border-[#9b4d43]/20 bg-[#9b4d43]/7 text-[#9b4d43]",
};

const difficultyOrder = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export default function LeetCodeList({ json_path, category }) {
  const [articles, setArticles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [query, setQuery] = useState("");

  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  useEffect(() => {
    let cancelled = false;

    fetch(json_path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Unable to load notes (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setArticles(data);

        const tagsSet = new Set();
        data.forEach((article) =>
          (article.tags || []).forEach((tag) => tagsSet.add(tag))
        );
        setAllTags([...tagsSet].sort());
      })
      .catch((error) => {
        console.error("Error loading Leetcode notes:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [json_path]);

  useEffect(() => {
    if (selectedTag && !selectedTags.includes(selectedTag)) {
      setSelectedTags([selectedTag]);
    }
  }, [selectedTag, selectedTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedDifficulty, selectedTags, sortConfig]);

  const toggleDifficulty = (difficulty) => {
    setSelectedDifficulty((current) =>
      current.includes(difficulty)
        ? current.filter((item) => item !== difficulty)
        : [...current, difficulty]
    );
  };

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((current) => [...current, tag]);
    }
    setSearchTag("");
  };

  const removeTag = (tag) => {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  };

  const extractLeetcodeNumber = (title) => {
    const match = title.match(/\[ Leetcode (\d+) \]/i);
    return match ? parseInt(match[1], 10) : Infinity;
  };

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...articles]
      .filter((article) => {
        const matchesDifficulty =
          selectedDifficulty.length === 0 ||
          selectedDifficulty.includes(article.difficulty);

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => (article.tags || []).includes(tag));

        const matchesQuery =
          !normalizedQuery ||
          article.title.toLowerCase().includes(normalizedQuery) ||
          (article.tags || []).some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
          );

        return matchesDifficulty && matchesTags && matchesQuery;
      })
      .sort((a, b) => {
        if (sortConfig.key === "difficulty") {
          const aValue = difficultyOrder[a.difficulty] || 0;
          const bValue = difficultyOrder[b.difficulty] || 0;
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (sortConfig.key === "title") {
          const aValue = extractLeetcodeNumber(a.title);
          const bValue = extractLeetcodeNumber(b.title);
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (sortConfig.key === "proficiency") {
          const aValue = a.proficiency || 0;
          const bValue = b.proficiency || 0;
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        const aValue =
          sortConfig.key === "date"
            ? new Date(a.date)
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "date"
            ? new Date(b.date)
            : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    articles,
    query,
    selectedDifficulty,
    selectedTags,
    sortConfig,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  );

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
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

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#857968]">
            Knowledge base
          </p>
          <h1 className="mt-5 font-serif text-5xl font-normal tracking-[-0.03em] text-[#29251f] sm:text-6xl">
            Leetcode Notes
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-8 text-[#6d655b]">
            Problems, patterns, and personal notes collected along the way.
          </p>
        </header>

        <section className="border-y border-[#756c60]/16 py-6">
          <div className="flex flex-col gap-5">
            <div className="relative">
              <Search
                size={18}
                strokeWidth={1.6}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8c8174]"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions or tags..."
                className="w-full border-0 border-b border-[#756c60]/16 bg-transparent py-3 pl-8 pr-3 font-serif text-lg text-[#302b25] outline-none placeholder:text-[#9b9185] focus:border-[#456b9b]/35"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {["Easy", "Medium", "Hard"].map((level) => {
                const active = selectedDifficulty.includes(level);

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleDifficulty(level)}
                    className={[
                      "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] transition-all",
                      active
                        ? "border-[#302b25] bg-[#302b25] text-[#f4efe6]"
                        : "border-[#756c60]/18 bg-white/10 text-[#625b52] hover:bg-white/35",
                    ].join(" ")}
                  >
                    {level}
                  </button>
                );
              })}

              <div className="relative ml-auto min-w-[190px]">
                <input
                  type="text"
                  value={searchTag}
                  onChange={(event) => setSearchTag(event.target.value)}
                  placeholder="Add a tag..."
                  className="w-full rounded-full border border-[#756c60]/18 bg-white/10 px-4 py-2 text-sm text-[#4d4740] outline-none placeholder:text-[#9a9084] focus:border-[#456b9b]/35"
                />

                {searchTag && (
                  <div className="absolute right-0 z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-[#756c60]/12 bg-[#fbf8f2] p-2 shadow-[0_16px_40px_rgba(55,44,29,0.12)]">
                    {allTags
                      .filter((tag) =>
                        tag.toLowerCase().includes(searchTag.toLowerCase())
                      )
                      .slice(0, 8)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#5d554b] hover:bg-black/[0.035]"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="inline-flex items-center gap-2 text-[12px] text-[#456b9b]"
                  >
                    #{tag}
                    <X size={13} strokeWidth={1.7} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em] text-[#7c7368]">
          <span>
            {filteredArticles.length === 0
              ? "0 notes"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredArticles.length
                )} of ${filteredArticles.length} notes`}
          </span>

          <div className="flex flex-wrap gap-4">
            {[
              ["date", "Date"],
              ["title", "Question"],
              ["difficulty", "Difficulty"],
              ["proficiency", "Proficiency"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSort(key)}
                className={
                  sortConfig.key === key
                    ? "text-[#456b9b]"
                    : "hover:text-[#302b25]"
                }
              >
                {label}
                {sortConfig.key === key &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-5 border-t border-[#756c60]/16">
          {paginatedArticles.map((article, index) => (
            <motion.article
              key={article.path}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.025, 0.25),
              }}
              className="border-b border-[#756c60]/16"
            >
              <Link
                href={`/${category}/articles/${article.path}`}
                target="_blank"
                className="group grid grid-cols-1 gap-5 py-7 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center sm:gap-7 sm:py-8"
              >
                <div className="font-mono text-[11px] tracking-[0.1em] text-[#8f8579]">
                  {article.date}
                </div>

                <div className="min-w-0">
                  <h2 className="font-serif text-[1.65rem] leading-tight tracking-[-0.018em] text-[#302b25] transition-colors group-hover:text-[#456b9b]">
                    {article.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em]",
                        difficultyStyles[article.difficulty] ||
                          "border-[#756c60]/16 text-[#6a6258]",
                      ].join(" ")}
                    >
                      {article.difficulty}
                    </span>

                    {(article.tags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-[#837a6f]"
                      >
                        #{tag}
                      </span>
                    ))}

                    {(article.tags || []).length > 4 && (
                      <span className="text-[11px] text-[#9a9084]">
                        +{article.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {article.proficiency != null && (
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span
                          key={value}
                          className={
                            value <= (article.proficiency || 0)
                              ? "text-[#b68b43]"
                              : "text-[#cfc6ba]"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.5}
                  className="hidden text-[#8b8174] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                />
              </Link>
            </motion.article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl text-[#3e3831]">
                No matching notes.
              </p>
              <p className="mt-3 font-serif text-sm italic text-[#7b7267]">
                Try removing a filter or searching for another topic.
              </p>
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full px-4 py-2 text-sm text-[#6b6257] transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 2
              )
              .map((page, index, visiblePages) => {
                const previousPage = visiblePages[index - 1];
                const showEllipsis =
                  previousPage !== undefined && page - previousPage > 1;

                return (
                  <span key={page} className="inline-flex items-center">
                    {showEllipsis && (
                      <span className="px-2 text-sm text-[#8c8174]">…</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={[
                        "h-10 min-w-10 rounded-full px-3 text-sm transition-colors",
                        page === currentPage
                          ? "bg-[#2d2924] text-[#f4efe6]"
                          : "text-[#6b6257] hover:bg-black/[0.04]",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-full px-4 py-2 text-sm text-[#6b6257] transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </nav>
        )}

      </div>
    </main>
  );
}
