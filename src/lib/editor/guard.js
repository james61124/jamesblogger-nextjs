// 編輯器只在 npm run dev 時能用。
// 預設只接受本機（localhost）的請求；想用手機在同一個 Wi-Fi 下打開，
// 要在 .env.local 設 EDITOR_TOKEN，用 npm run dev:lan 啟動，再打開 http://<電腦的 IP>:3001/editor?token=...
// 第一次帶 token 進來後會存成 cookie，之後的頁面和 API 都用 cookie 驗證。

export const isDev = process.env.NODE_ENV === "development";
export const TOKEN_COOKIE = "editor_token";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

// host 會帶 port，例如 localhost:3001 或 [::1]:3001
export function isLocalHost(host = "") {
  return LOCAL_HOSTS.has(host.replace(/:\d+$/, ""));
}

export function tokenMatches(token) {
  const expected = process.env.EDITOR_TOKEN;
  return Boolean(expected && token && token === expected);
}

// 頁面用：回傳 true 才顯示編輯器
export function canOpenEditor({ host, cookieToken, queryToken }) {
  return isDev && (isLocalHost(host) || tokenMatches(cookieToken) || tokenMatches(queryToken));
}

function cookieValue(request, name) {
  const match = (request.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

// API 用：不符合就回傳 404 / 403 的 Response，符合回傳 null
export function rejectEditorRequest(request) {
  if (!isDev) return new Response("Not found", { status: 404 });
  const host = request.headers.get("host") || "";
  if (isLocalHost(host) || tokenMatches(cookieValue(request, TOKEN_COOKIE))) return null;
  return new Response("Forbidden", { status: 403 });
}
