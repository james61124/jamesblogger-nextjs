import Article from "@/components/Article";
import fs from "fs";
import path from "path";
import { Suspense } from "react";

// Server Component
export default function CategoryPage({ params, searchParams }) {
  const { fileName } = params;
  const { json_path, title, category } = searchParams || {};

  if (!fileName) {
    return <h1 className="text-center text-3xl mt-10">請選擇一篇文章</h1>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article json_path={json_path} title={title} category={category} fileName={fileName}/>;
    </Suspense>
  );
}

export async function generateStaticParams() {
  const categories = ["life", "program", "travel"];
  let paths = [];

  categories.forEach((category) => {
    const dirPath = path.join(process.cwd(), "public", "article", category);
    
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const fileName = path.parse(file).name; // 取檔案名稱 (不含副檔名)
        paths.push({ "category": category, "fileName": fileName });
      });
    }
  });

  return paths;
}
