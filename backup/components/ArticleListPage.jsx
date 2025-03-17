import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 模擬從 API 獲取文章列表
    const fetchArticles = async () => {
      const mockData = [
        {
          id: 1,
          title: "深入理解 React Server Components",
          summary: "探索 React 最新的 Server Components 功能，優化你的應用效能與結構。",
          image: "/images/Guitar.JPEG",
          slug: "react-server-components",
        },
        {
          id: 2,
          title: "打造優雅的 Tailwind CSS 設計系統",
          summary: "使用 Tailwind CSS 建立一個高效、模組化且易於維護的設計系統。",
          image: "/images/Guitar.JPEG",
          slug: "tailwind-design-system",
        },
        {
          id: 3,
          title: "Django + React 完整整合指南",
          summary: "學習如何結合 Django 與 React，打造強大且可擴展的全端應用。",
          image: "/images/Guitar.JPEG",
          slug: "django-react-guide",
        },
      ];
      setArticles(mockData);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h1 className="text-4xl font-bold mb-12 text-center">文章列表</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <motion.div
            key={article.id}
            className="group overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/articles/${article.slug}`}>
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">{article.summary}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}