import { EDITOR_CATEGORIES, SLUG_PATTERN } from "@/lib/editor/articles";
import { listAll, publicUrl } from "@/lib/editor/r2";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

// 這篇文章 R2 資料夾裡的所有檔案，給照片集編輯器的「照片庫」用
export const GET = editorRoute(async (request) => {
  const params = new URL(request.url).searchParams;
  const category = params.get("category");
  const slug = params.get("slug");
  if (!EDITOR_CATEGORIES.includes(category) || !SLUG_PATTERN.test(slug || "")) throw new Error("Unknown article");
  const objects = await listAll(`images/${category}/${slug}/`);
  return {
    files: objects
      .filter((object) => !object.key.endsWith("/"))
      .map((object) => ({
        url: publicUrl(object.key),
        kind: /\.(mp4|webm|mov)$/i.test(object.key) ? "video" : "image",
      }))
      .sort((a, b) => a.url.localeCompare(b.url)),
  };
});
