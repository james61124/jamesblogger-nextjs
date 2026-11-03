import { rejectEditorRequest } from "@/lib/editor/guard";

// 每個編輯器 API 都先檢查是不是 dev、是不是本機，再統一處理錯誤
export function editorRoute(handler) {
  return async (request, context) => {
    const rejected = rejectEditorRequest(request);
    if (rejected) return rejected;
    try {
      return Response.json(await handler(request, context));
    } catch (error) {
      console.error("[editor]", error);
      return Response.json({ error: error.message || String(error) }, { status: 400 });
    }
  };
}
