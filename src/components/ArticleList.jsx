"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

const articlesPerPage = 6;

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

        setArticles(filteredData);
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
    <div
      className="min-h-screen pt-32 pb-32 px-8"
      style={{
        background: "linear-gradient(to bottom, #f9fafb, #e5e7eb)",
      }}
    >
      {/* 頁面標題 */}
      <motion.h1
        className="text-4xl font-bold mb-16 text-center text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {realTitle}
      </motion.h1>

      {/* 文章列表 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {currentArticles.map((article, index) => (
            <motion.div
              key={article.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={{
                  pathname: `/${category}/articles/${article.path}`,
                  query: {  json_path: json_path,
                            title: title,
                            category: category},
                }}
                className="group block overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 bg-white"
              >
                {/* 文章圖片 */}
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={600}
                    height={300}
                    className="w-full h-56 object-cover"
                  />
                </motion.div>
                {/* 文章內容 */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-all">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mt-4 line-clamp-3">
                    {article.description}
                  </p>
                  <p className="mt-6 text-sm text-gray-500">發佈日期：{article.date}</p>

                  {/* Tag 顯示區域 */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags.slice(0, 4).map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                      {article.tags.length > 4 && (
                        <span className="px-3 py-1 text-sm font-medium bg-gray-300 text-gray-700 rounded-full">
                          +{article.tags.length - 4} 更多
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 分頁按鈕 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
      </motion.div>
    </div>
  );
}
