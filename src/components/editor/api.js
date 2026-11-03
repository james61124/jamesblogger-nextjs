// 編輯器前端呼叫 API 的小工具

export async function api(path, { method = "GET", body } = {}) {
  const response = await fetch(`/api/editor/${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

// 一次傳一個檔案：轉檔很吃 CPU，同時傳太多反而慢
export async function uploadFiles(files, { category, slug }, onProgress) {
  const results = [];
  for (const [index, file] of files.entries()) {
    onProgress?.({ index, total: files.length, name: file.name, status: "uploading" });
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    form.append("slug", slug);
    form.append("lastModified", String(file.lastModified || Date.now()));
    const response = await fetch("/api/editor/upload", { method: "POST", body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      onProgress?.({ index, total: files.length, name: file.name, status: "error", error: data.error });
      continue;
    }
    results.push(data);
    onProgress?.({ index, total: files.length, name: file.name, status: "done" });
  }
  return results;
}

export const isMediaFile = (file) => /^(image|video)\//.test(file.type) || /\.(heic|heif)$/i.test(file.name);

export const escapeAttr = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
