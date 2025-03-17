import ArticleList from "@/components/ArticleList";

export default function LeetcodePage({ params, searchParams }) {
  const { fileName } = params;
  const json_path = searchParams?.json_path; // ✅ 修正這裡
  const title = searchParams?.title;         // ✅ 修正這裡
  const category = searchParams?.category;   

  return <ArticleList json_path={json_path} title={title} category={category} />;
}

// 產生靜態頁面
export async function generateStaticParams() {
  return [
    { fileName: "two-sum" },
    { fileName: "binary-tree-traversal" },
  ];
}
