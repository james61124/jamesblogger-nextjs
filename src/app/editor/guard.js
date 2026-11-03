import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { TOKEN_COOKIE, canOpenEditor, tokenMatches } from "@/lib/editor/guard";

// 不是 dev、或不是本機又沒有正確 token，就當作這個頁面不存在
export async function guardEditorPage(searchParams) {
  const [headerList, cookieStore, params] = await Promise.all([headers(), cookies(), searchParams]);
  const queryToken = params?.token;
  const allowed = canOpenEditor({
    host: headerList.get("host") || "",
    cookieToken: cookieStore.get(TOKEN_COOKIE)?.value,
    queryToken,
  });
  if (!allowed) notFound();
  // 帶著正確 token 進來的話交給前端存成 cookie
  return tokenMatches(queryToken) ? queryToken : null;
}
