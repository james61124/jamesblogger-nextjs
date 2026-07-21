"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

const articlesPerPage = 24;

export default function ArticleListPage({ json_path, title, category }) {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [realTitle, setTitle] = useState(title);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  useEffect(() => {
    fetch(json_path)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = selectedTag
          ? data.filter((article) => article.tags && article.tags.includes(selectedTag))
          : data;

          const sortedData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        setArticles(sortedData);
        setTitle(selectedTag || title);
      })
      .catch((error) => {
        console.error("Error loading metadata.json:", error);
      });
  }, [json_path, selectedTag]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

return (
  <main className="min-h-screen bg-[#f4efe6] px-5 pb-28 pt-32 sm:px-8 lg:px-12">
    {/* 紙張紋理 */}
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-25"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.12) 0.65px, transparent 0)",
        backgroundSize: "6px 6px",
      }}
    />

    <div className="relative mx-auto max-w-[1450px]">
      {/* 頁面標題 */}
      <motion.header
        className="mb-16 text-center sm:mb-20"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968]">
          Personal Journal
        </p>

        <h1 className="mt-4 font-serif text-5xl font-normal tracking-[-0.025em] text-[#29251f] sm:text-6xl">
          {realTitle}
        </h1>

        <div className="mx-auto mt-7 h-px w-14 bg-[#786f63]/35" />
      </motion.header>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {currentArticles.map((article, index) => (
            <motion.article
              key={article.path}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.05, 0.3),
              }}
            >
              <Link
                href={{
                  pathname: `/${category}/articles/${article.path}`,
                }}
                className="group block"
              >
                {/* 圖片 */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd5c8]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.035]" />
                </div>

                {/* 文章內容 */}
                <div className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#817769]">
                      {article.date}
                    </p>

                    {article.tags?.[0] && (
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#476c9d]">
                        {article.tags[0]}
                      </p>
                    )}
                  </div>

                  <h2 className="mt-4 font-serif text-[1.85rem] font-normal leading-[1.2] tracking-[-0.018em] text-[#29251f] transition-colors duration-300 group-hover:text-[#456b9b]">
                    {article.title}
                  </h2>

                  <p className="mt-4 line-clamp-3 font-serif text-[15px] leading-7 text-[#6b645a]">
                    {article.description}
                  </p>

                  {article.tags && article.tags.length > 1 && (
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {article.tags.slice(1, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[12px] text-[#847a6c]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#514b43]">
                    <span>Read story</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <motion.div
          className="mt-24 flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </motion.div>
      )}
    </div>
  </main>
);
}
