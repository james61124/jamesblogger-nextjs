import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Pagination from "./Pagination";

const articlesPerPage = 6;
const difficultyTags = ["Easy", "Medium", "Hard"];

export default function ArticleCategoryPage({ json_path }) {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [generalTags, setGeneralTags] = useState([]);

  useEffect(() => {
    fetch(json_path)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);

        // 獲取所有標籤，排除難度標籤
        const extractedTags = Array.from(
          new Set(data.flatMap((a) => a.tags).filter((tag) => !difficultyTags.includes(tag)))
        );
        setGeneralTags(extractedTags);
      });
  }, [json_path]);

  // 切換「難度」標籤 (單選)
  const toggleDifficulty = (tag) => {
    setSelectedDifficulty((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 切換「一般」標籤 (多選)
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 排序
  const handleSortChange = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  // 過濾與排序
  const filteredArticles = articles
  .filter((article) => 
    (selectedDifficulty.length === 0 || selectedDifficulty.some((tag) => article.tags.includes(tag))) &&
    (selectedTags.length === 0 || selectedTags.some((tag) => article.tags.includes(tag)))
  )
  .sort((a, b) => (sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)));

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6 lg:px-20">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        文章分類專區
      </h1>

      {/* 標籤篩選區 */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
        {/* 左側標籤區 */}
        <div className="flex flex-col gap-4">
          {/* 難度標籤 (多選) */}
          <div className="flex flex-wrap gap-3">
            {difficultyTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleDifficulty(tag)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all shadow-sm
                  ${
                    selectedDifficulty?.includes(tag)
                      ? "bg-gray-900 text-white"
                      : "border-gray-400 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 一般標籤 (多選) */}
          <div className="flex flex-wrap gap-3">
            {generalTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all shadow-sm
                  ${
                    selectedTags.includes(tag)
                      ? "bg-gray-900 text-white"
                      : "border-gray-400 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 右側排序選擇 */}
        <button
          onClick={handleSortChange}
          className="px-5 py-2.5 flex items-center gap-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
        >
          {sortOrder === "newest" ? "最新優先" : "最舊優先"}
          <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 文章列表 */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/article/${article.slug}`}
            className="group block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 bg-white"
          >
            <img src={article.image} alt={article.title} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600">
                {article.title}
              </h2>
              <p className="text-gray-600 mt-4 line-clamp-3">{article.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-full">
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="px-3 py-1 text-sm font-medium bg-gray-300 text-gray-700 rounded-full">
                    +{article.tags.length - 3} 更多
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* 分頁 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={setCurrentPage} />
    </div>
  );
}
