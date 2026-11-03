import { notFound } from "next/navigation";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { CITIES, COUNTRIES } from "@/lib/travel";
import { readArticle } from "@/lib/editor/articles";
import { guardEditorPage } from "../../guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editor · James Blogger", robots: { index: false } };

export default async function EditArticlePage({ params, searchParams }) {
  await guardEditorPage(searchParams);
  const { category, slug } = await params;
  let article;
  try {
    article = await readArticle(category, slug);
  } catch {
    notFound();
  }
  // key：改文章代號後換到新網址時，整個編輯器用新的資料重新開始
  return <EditorWorkspace key={`${category}/${slug}`} initial={article} countries={COUNTRIES} cities={CITIES} />;
}
