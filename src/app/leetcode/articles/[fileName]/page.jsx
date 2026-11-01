import Article from "@/components/Article";
import { Suspense } from "react";
import { getArticleFileNames, LEETCODE_JSON_PATH } from "@/lib/categories";

export default async function ArticlePage({ params }) {
  const { fileName } = await params;

  if (!fileName) {
    return <h1 className="text-center text-3xl mt-10">請選擇一篇文章</h1>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Article category="leetcode" fileName={fileName} json_path={LEETCODE_JSON_PATH} title="Leetcode Notes" />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return getArticleFileNames("leetcode").map((fileName) => ({ fileName }));
}
