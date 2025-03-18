import ArticleList from "@/components/ArticleList";
import { Suspense } from "react";

export default function LeetcodePage({ params, searchParams }) {
  const { fileName } = params;
  const json_path = searchParams?.json_path; // ✅ 修正這裡
  const title = searchParams?.title;         // ✅ 修正這裡
  const category = searchParams?.category;   

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleList json_path={json_path} title={title} category={category} />;
    </Suspense>
  );
}

export async function generateStaticParams() {
  return [
    { category: "life" },
    { category: "program" },
    { category: "travel" }
  ];
}
