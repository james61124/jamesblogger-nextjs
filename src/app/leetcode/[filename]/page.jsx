// app/article/leetcode/[fileName]/page.jsx
import LeetcodeList from "../../components/LeetcodeList";

export default function LeetcodePage({ params }) {
  const { fileName } = params;

  return <LeetcodeList fileName={fileName} />;
}

// 產生靜態頁面
export async function generateStaticParams() {
  return [
    { fileName: "two-sum" },
    { fileName: "binary-tree-traversal" },
  ];
}
