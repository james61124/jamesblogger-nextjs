import Article from "../../../../components/Article";
import { Suspense } from "react";
import { CATEGORIES, getArticleFileNames, getCategoryConfig } from "@/lib/categories";

export default async function ArticlePage({ params }) {
  const { category, fileName } = await params;
  const { title, json_path } = getCategoryConfig(category);

  if (!fileName) {
    return (
      <h1 className="mt-10 text-center text-3xl">
        請選擇一篇文章
      </h1>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article
        json_path={json_path}
        title={title}
        category={category}
        fileName={fileName}
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return CATEGORIES.flatMap((category) =>
    getArticleFileNames(category).map((fileName) => ({ category, fileName }))
  );
}
