// 編輯器讀寫文章：markdown 檔（public/article/<分類>/<代號>.md）和分類的 metadata JSON 要一起更新。

import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { calculateReadTime, parseFrontmatter } from "@/lib/markdown";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";
import { PUBLIC_BASE, movePrefix } from "@/lib/editor/r2";

const ROOT = process.cwd();
const ARTICLE_DIR = path.join(ROOT, "public", "article");

// 編輯器能新增文章的分類（leetcode 有自己的流程，不放進來）
export const EDITOR_CATEGORIES = CATEGORIES;

const FIELD_ORDER = ["title", "date", "author", "tags", "country", "cities", "type", "image", "description", "readTime", "id"];
const QUOTED = new Set(["date", "description"]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertCategory(category) {
  if (!EDITOR_CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}`);
}

function assertSlug(slug) {
  if (!SLUG_PATTERN.test(slug)) throw new Error("文章代號只能用小寫英文、數字和連字號，例如 paris-20250301");
}

const articlePath = (category, slug) => path.join(ARTICLE_DIR, category, `${slug}.md`);
const metadataPath = (category) => path.join(ROOT, "public", getCategoryConfig(category).json_path);
const unquote = (value) => (typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : value);
const oneLine = (value) => String(value ?? "").replace(/\s*\n\s*/g, " ").trim();

function serialize(meta, body) {
  const keys = [...FIELD_ORDER, ...Object.keys(meta).filter((key) => !FIELD_ORDER.includes(key))];
  const lines = keys
    .filter((key) => meta[key] !== undefined && meta[key] !== null && String(meta[key]).trim() !== "")
    .map((key) => {
      const value = oneLine(meta[key]);
      return `${key}: ${QUOTED.has(key) ? `"${value.replace(/"/g, "”")}"` : value}`;
    });
  return `---\n${lines.join("\n")}\n---\n\n${body.trim()}\n`;
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf-8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 4));
}

// metadata JSON 是文章列表頁用的，欄位跟 frontmatter 對應
async function syncMetadata(category, slug, meta, previousSlug = slug) {
  const file = metadataPath(category);
  const entries = await readJson(file);
  const entry = {
    title: meta.title,
    date: meta.date,
    author: meta.author,
    tags: String(meta.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    image: meta.image || "",
    description: meta.description || "",
    readTime: Number(meta.readTime) || 1,
    id: meta.id,
    path: slug,
  };
  const index = entries.findIndex((item) => item.path === previousSlug);
  if (index >= 0) entries[index] = { ...entries[index], ...entry };
  else entries.push(entry);
  await writeJson(file, entries);
}

export async function listArticles() {
  const result = [];
  for (const category of EDITOR_CATEGORIES) {
    let files = [];
    try {
      files = await fs.readdir(path.join(ARTICLE_DIR, category));
    } catch {}
    for (const file of files.filter((name) => name.endsWith(".md"))) {
      const raw = await fs.readFile(path.join(ARTICLE_DIR, category, file), "utf-8");
      const { metadata } = parseFrontmatter(raw);
      result.push({
        category,
        slug: file.replace(/\.md$/, ""),
        title: unquote(metadata.title) || file,
        date: unquote(metadata.date) || "",
        type: unquote(metadata.type) || "article",
      });
    }
  }
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export async function readArticle(category, slug) {
  assertCategory(category);
  assertSlug(slug);
  const raw = await fs.readFile(articlePath(category, slug), "utf-8");
  const { metadata, body } = parseFrontmatter(raw);
  return { category, slug, meta: Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, unquote(v)])), body };
}

export async function saveArticle(category, slug, meta, body) {
  assertCategory(category);
  assertSlug(slug);
  const clean = { ...meta, id: meta.id || randomUUID(), author: meta.author || "James", readTime: calculateReadTime(body) };
  if (clean.type === "article") delete clean.type;
  await fs.writeFile(articlePath(category, slug), serialize(clean, body));
  await syncMetadata(category, slug, clean);
  return readArticle(category, slug);
}

export async function createArticle(category, slug, meta, body = "") {
  assertCategory(category);
  assertSlug(slug);
  try {
    await fs.access(articlePath(category, slug));
    throw new Error(`已經有一篇 ${category}/${slug} 了`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.mkdir(path.join(ARTICLE_DIR, category), { recursive: true });
  return saveArticle(category, slug, meta, body);
}

// 掃過所有會引用 R2 網址的檔案：文章、metadata JSON 和程式碼
async function referenceFiles() {
  const files = [];
  const walk = async (dir, pattern) => {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full, pattern);
      else if (pattern.test(entry.name)) files.push(full);
    }
  };
  await walk(ARTICLE_DIR, /\.md$/);
  await walk(path.join(ROOT, "public", "metadata"), /\.json$/);
  await walk(path.join(ROOT, "src"), /\.(jsx?|tsx?)$/);
  return files;
}

// 改文章代號：md 檔改名、R2 資料夾搬家、所有引用到舊網址的地方一起換掉
export async function renameArticle(category, oldSlug, newSlug) {
  assertCategory(category);
  assertSlug(oldSlug);
  assertSlug(newSlug);
  if (oldSlug === newSlug) return { moved: 0, rewritten: 0 };
  try {
    await fs.access(articlePath(category, newSlug));
    throw new Error(`已經有一篇 ${category}/${newSlug} 了`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const fromPrefix = `images/${category}/${oldSlug}/`;
  const toPrefix = `images/${category}/${newSlug}/`;
  const moved = await movePrefix(fromPrefix, toPrefix);

  let rewritten = 0;
  const oldUrl = `${PUBLIC_BASE}/${fromPrefix}`;
  const newUrl = `${PUBLIC_BASE}/${toPrefix}`;
  for (const file of await referenceFiles()) {
    if (file.includes(`${path.sep}lib${path.sep}editor${path.sep}`)) continue;
    const text = await fs.readFile(file, "utf-8");
    if (!text.includes(oldUrl)) continue;
    await fs.writeFile(file, text.split(oldUrl).join(newUrl));
    rewritten += 1;
  }

  await fs.rename(articlePath(category, oldSlug), articlePath(category, newSlug));

  const file = metadataPath(category);
  const entries = await readJson(file);
  const entry = entries.find((item) => item.path === oldSlug);
  if (entry) {
    entry.path = newSlug;
    await writeJson(file, entries);
  }
  return { moved, rewritten };
}

// 所有被引用到的 R2 檔案 key
export async function referencedKeys() {
  const keys = new Set();
  const prefix = `${PUBLIC_BASE}/`;
  const pattern = new RegExp(`${prefix.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}([^\\s"'()<>\\]\`]+)`, "g");
  for (const file of await referenceFiles()) {
    const text = await fs.readFile(file, "utf-8");
    for (const match of text.matchAll(pattern)) keys.add(decodeURIComponent(match[1]));
  }
  return keys;
}
