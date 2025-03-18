"use client";

import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import Article from "../../../../components/Article";
import { use } from "react";

export default function CategoryPage({ params, searchParams }) {
  const { fileName } = useParams(); 

  if (!fileName) {
    return <h1 className="text-center text-3xl mt-10">請選擇一篇文章</h1>;
  }

  return <Article category="leetcode" fileName={fileName} json_path="/metadata/leetcode_metadata.json" title="Leetcode Notes"/>;
}

// 預先產生靜態頁面 (SEO 友好)
// export async function generateStaticParams() {
//   return [
//     { category: "life", fileName: "asml" },
//     { category: "program", fileName: "nextjs-guide" },
//     { category: "travel", fileName: "kyoto-trip" },
//   ];
// }