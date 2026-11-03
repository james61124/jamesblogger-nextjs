import EditorHome from "@/components/editor/EditorHome";
import { CITIES, COUNTRIES } from "@/lib/travel";
import { EDITOR_CATEGORIES } from "@/lib/editor/articles";
import { guardEditorPage } from "./guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editor · James Blogger", robots: { index: false } };

export default async function EditorPage({ searchParams }) {
  const token = await guardEditorPage(searchParams);
  return <EditorHome token={token} categories={EDITOR_CATEGORIES} countries={COUNTRIES} cities={CITIES} />;
}
