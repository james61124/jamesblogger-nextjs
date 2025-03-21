import ArticleList from "@/components/ArticleList";
import { Suspense } from "react";

export default function LeetcodePage({ params, searchParams }) {
  const { category } = params; 

  const defaultConfig = {
    life: {
      title: "Life Journal",
      json_path: "/metadata/life_metadata.json",
    },
    travel: {
      title: "Journey Memories",
      json_path: "/metadata/travel_metadata.json",
    },
    program: {
      title: "Program Notes",
      json_path: "/metadata/program_metadata.json",
    },
  };

  const { title, json_path } = defaultConfig[category] || {
    title: queryTitle || "Default Articles",
    json_path: queryJsonPath || "/metadata/default_metadata.json",
  };

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
