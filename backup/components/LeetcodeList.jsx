import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✨ 加入動畫

const difficultyColors = {
  Easy: "text-green-600 bg-green-100",
  Medium: "text-yellow-600 bg-yellow-100",
  Hard: "text-red-600 bg-red-100",
};

export default function LeetCodeList({ json_path, category }) {
  const [articles, setArticles] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); 

  useEffect(() => {
    fetch(json_path)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        // 抓出所有 tags
        const tagsSet = new Set();
        data.forEach(article => article.tags.forEach(tag => tagsSet.add(tag)));
        setAllTags([...tagsSet]);
      });
  }, [json_path]);

  useEffect(() => {
    const tagFromURL = searchParams.get("tag");
    if (tagFromURL && !selectedTags.includes(tagFromURL)) {
      setSelectedTags([tagFromURL]); // 只選擇 URL 內的標籤
    }
  }, [searchParams]);

  // 切換「難度」標籤 (多選)
  const toggleDifficulty = (difficulty) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // 添加標籤篩選
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchTag(""); // 清空搜尋欄
  };

  // 移除標籤篩選
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // 設定排序方式
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 過濾與排序邏輯
  const filteredArticles = articles
    .filter(article =>
      (selectedDifficulty.length === 0 || selectedDifficulty.includes(article.difficulty)) &&
      (selectedTags.length === 0 || selectedTags.every(tag => article.tags.includes(tag)))
    )
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // 日期排序
      if (sortConfig.key === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6 lg:px-16">
      <motion.h1
        className="text-4xl font-bold mb-16 text-center text-gray-900 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Leetcode Notes
      </motion.h1>

      {/* 篩選區 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* 難度篩選 */}
        <div className="flex gap-2">
          {["Easy", "Medium", "Hard"].map(level => (
            <button
              key={level}
              onClick={() => toggleDifficulty(level)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all shadow-sm ${
                selectedDifficulty.includes(level) ? "bg-gray-900 text-white" : "border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* 一般標籤篩選 */}
        <div className="relative">
          <input
            type="text"
            className="px-4 py-2 border rounded-lg text-sm w-48"
            placeholder="搜尋標籤..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
          {searchTag && (
            <ul className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-lg max-h-40 overflow-y-auto">
              {allTags
                .filter(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
                .map(tag => (
                  <li
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                  >
                    {tag}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* 選擇的標籤 */}
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-full flex items-center gap-2">
              {tag}
              <button onClick={() => removeTag(tag)} className="text-red-500 text-xs">✕</button>
            </span>
          ))}
        </div>

        {/* 日期排序 */}
        <button
          onClick={() => handleSort("date")}
          className="px-5 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
        >
          {sortConfig.key === "date" && sortConfig.direction === "desc" ? "最新優先" : "最舊優先"}
        </button>
      </div>

      {/* 表格列表 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th onClick={() => handleSort("date")} className="px-6 py-3 text-left text-gray-700 font-semibold cursor-pointer">
                Date
              </th>
              <th onClick={() => handleSort("title")} className="px-6 py-3 text-left text-gray-700 font-semibold cursor-pointer">
                Question
              </th>
              <th onClick={() => handleSort("difficulty")} className="px-6 py-3 text-left text-gray-700 font-semibold cursor-pointer">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map(article => (
              <tr
                key={article.slug}
                className="border-t hover:bg-gray-100 transition-all cursor-pointer"
                onClick={() => window.location.href = `/${category}/${article.path}`}
              >
                <td className="px-6 py-4 text-sm">
                  <div className="whitespace-nowrap">{article.date}</div>
                </td>
                <td className="px-6 py-4 font-medium text-blue-600">{article.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[article.difficulty]}`}>
                    {article.difficulty}
                  </span>
                </td>
                <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-full">
                        {tag}
                    </span>
                    ))}
                    {article.tags.length > 4 && (
                    <span className="px-3 py-1 text-sm font-medium bg-gray-300 text-gray-700 rounded-full">
                        +{article.tags.length - 4} 更多
                    </span>
                    )}
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
