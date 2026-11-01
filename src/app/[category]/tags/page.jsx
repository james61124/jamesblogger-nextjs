import ArticleList from "../../../components/ArticleList";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryTagsPage({ params, searchParams }) {
  const { category } = params;
  const json_path = searchParams?.json_path;
  const title = searchParams?.title;

  return <ArticleList json_path={json_path} title={title} category={category} />;
}

// 產生靜態頁面
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}
