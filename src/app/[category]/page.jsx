import ArticleList from "../../components/ArticleList";
import { Suspense } from "react";

export default async function LeetcodePage({ params, searchParams }) {
  const { category } = await params;

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
    other: {
      title: "Program Notes",
      json_path: "/metadata/other_metadata.json",
    },
  };

  const { title, json_path } = defaultConfig[category] || {
    title: "Default Articles",
    json_path: "/metadata/default_metadata.json",
  };

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
  return [
    { category: "life" },
    { category: "program" },
    { category: "travel" },
    { category: "other" },
  ];
}