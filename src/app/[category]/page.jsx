import ArticleList from "@/components/ArticleList";
import { Suspense } from "react";

export default function LeetcodePage({ params, searchParams }) {
  const { fileName } = params;
  // const json_path = searchParams?.json_path; 
  // const title = searchParams?.title;      
  // const category = searchParams?.category;   
  const { json_path, title, category } = searchParams || {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleList json_path={json_path} title={title} category={category} />
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
