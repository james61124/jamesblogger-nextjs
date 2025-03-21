import ArticleList from "@/components/ArticleList";

export default function LeetcodePage({ params, searchParams }) {
  const { category, tagName } = params;
  const json_path = searchParams?.json_path; 
  const title = searchParams?.title;        
  // const category = searchParams?.category;  

  return <ArticleList json_path={json_path} title={title} category={category} />;
}

// 產生靜態頁面
export async function generateStaticParams() {
  return [
    { category: "life" },
    { category: "program" },
    { category: "travel" },
  ];
}
