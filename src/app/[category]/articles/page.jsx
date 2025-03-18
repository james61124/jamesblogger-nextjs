import Article from "@/components/Article";
import fs from "fs";
import path from "path";
import { Suspense } from "react";

// Server Component
export default function CategoryPage({ params, searchParams }) {
  const { json_path, title, category, file } = searchParams || {};

  if (!file) {
    return <h1 className="text-center text-3xl mt-10">請選擇一篇文章</h1>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article json_path={json_path} title={title} category={category} fileName={file}/>;
    </Suspense>
  );
}


export async function generateStaticParams() {
  return [
    { category: "life" },
    { category: "program" },
    { category: "travel" },
  ];
}