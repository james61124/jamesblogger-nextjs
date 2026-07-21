import Article from "../../../../components/Article";
import fs from "fs";
import path from "path";
import { Suspense } from "react";

export default async function CategoryPage({
  params,
  searchParams,
}) {
  const { category, fileName } = await params;

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
  const categories = ["life", "program", "travel", "other"];
  const paths = [];

  categories.forEach((category) => {
    const dirPath = path.join(
      process.cwd(),
      "public",
      "article",
      category
    );

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        paths.push({
          category,
          fileName: path.parse(file).name,
        });
      });
    }
  });

  return paths;
}