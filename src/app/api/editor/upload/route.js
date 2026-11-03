import { SLUG_PATTERN, EDITOR_CATEGORIES } from "@/lib/editor/articles";
import { uploadMedia } from "@/lib/editor/media";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = editorRoute(async (request) => {
  const form = await request.formData();
  const file = form.get("file");
  const category = String(form.get("category") || "");
  const slug = String(form.get("slug") || "");
  if (!file || typeof file === "string") throw new Error("沒有收到檔案");
  if (!EDITOR_CATEGORIES.includes(category) || !SLUG_PATTERN.test(slug)) throw new Error("分類或文章代號不正確");
  return uploadMedia({
    buffer: Buffer.from(await file.arrayBuffer()),
    name: file.name,
    lastModified: Number(form.get("lastModified")) || Date.now(),
    category,
    slug,
  });
});
