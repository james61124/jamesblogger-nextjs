import { referencedKeys } from "@/lib/editor/articles";
import { listAll, publicUrl, removeMany } from "@/lib/editor/r2";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

async function findUnused() {
  const [objects, used] = await Promise.all([listAll(), referencedKeys()]);
  return objects
    .filter((object) => !object.key.endsWith("/") && !used.has(object.key))
    .map((object) => ({ ...object, url: publicUrl(object.key) }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export const GET = editorRoute(async () => ({ files: await findUnused() }));

// 刪除前再檢查一次，只刪真的沒被引用的檔案，避免畫面開著時文章又用到了
export const DELETE = editorRoute(async (request) => {
  const { keys } = await request.json();
  const unused = new Set((await findUnused()).map((file) => file.key));
  const targets = (keys || []).filter((key) => unused.has(key));
  await removeMany(targets);
  return { deleted: targets.length, skipped: (keys || []).length - targets.length };
});
