import ArticleList from "../../components/ArticleList";
import { Suspense } from "react";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const { title, json_path } = getCategoryConfig(category);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleList
        json_path={json_path}
        title={title}
        category={category}
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}
