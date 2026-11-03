import { readArticle, saveArticle } from "@/lib/editor/articles";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

export const GET = editorRoute(async (request) => {
  const params = new URL(request.url).searchParams;
  return { article: await readArticle(params.get("category"), params.get("slug")) };
});

export const PUT = editorRoute(async (request) => {
  const { category, slug, meta, body } = await request.json();
  return { article: await saveArticle(category, slug, meta, body) };
});
