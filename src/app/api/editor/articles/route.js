import { createArticle, listArticles } from "@/lib/editor/articles";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

export const GET = editorRoute(async () => ({ articles: await listArticles() }));

export const POST = editorRoute(async (request) => {
  const { category, slug, meta, body } = await request.json();
  return { article: await createArticle(category, slug, meta, body) };
});
