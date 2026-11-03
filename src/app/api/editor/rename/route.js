import { renameArticle } from "@/lib/editor/articles";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

export const POST = editorRoute(async (request) => {
  const { category, from, to } = await request.json();
  return await renameArticle(category, from, to);
});
