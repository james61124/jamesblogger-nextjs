// app/article/[category]/[fileName]/page.jsx
import Article from "../../../components/Article";

// 允許的 category 清單
const categoryMap = {
  life: "Life Journal",
  travel: "Journey Memories",
  program: "Program Notes",
};

export default function ArticlePage({ params }) {
  const { category, fileName } = params;

  // 如果 category 不符合允許的清單，回傳 404
  if (!categoryMap[category]) {
    return <h1>404 - Page Not Found</h1>;
  }

  return <Article category={category} fileName={fileName} />;
}

// 預先產生靜態頁面 (SEO 友好)
export async function generateStaticParams() {
  return [
    { category: "life", fileName: "my-first-post" },
    { category: "program", fileName: "nextjs-guide" },
    { category: "travel", fileName: "kyoto-trip" },
  ];
}
