import fs from "fs";
import path from "path";
import Article from "@/components/Article";
import { Suspense } from "react";

// Server Component：透過 props 拿到 params
export default async function CategoryPage({ params }) {
  // 確保 params 是 Promise 時會等待解析
  const { fileName } = await params;

  if (!fileName) {
    return <h1 className="text-center text-3xl mt-10">請選擇一篇文章</h1>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article category="leetcode" fileName={fileName} json_path="/metadata/leetcode_metadata.json" title="Leetcode Notes" />;
    </Suspense>
  );
  
}

// 產生靜態路由
export async function generateStaticParams() {
  const articlesPath = path.join(process.cwd(), "public", "article", "leetcode");
  const filenames = fs.readdirSync(articlesPath);

  return filenames.map((file) => ({
    fileName: file.replace(".md", ""),
  }));
}
