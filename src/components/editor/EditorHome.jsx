"use client";

// 編輯器首頁：所有文章的列表、新增文章或照片集、未使用檔案的入口

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "./api";
import PlaceFields from "./PlaceFields";
import { Field, inputClass, PageShell } from "./ui";

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

function NewArticleForm({ categories, countries, cities, onCancel }) {
  const [places, setPlaces] = useState({ countries, cities });
  const router = useRouter();
  const [category, setCategory] = useState("travel");
  const [type, setType] = useState("article");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [country, setCountry] = useState("");
  const [citySlugs, setCitySlugs] = useState([]);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // 旅遊文章的代號預設是「第一個城市-日期」，例如 lucerne-20240912
  const suggested = useMemo(() => {
    const base = category === "travel" ? citySlugs[0] || country || slugify(title) : slugify(title);
    if (!base) return "";
    return category === "travel" ? `${base}-${date.replace(/-/g, "")}` : base;
  }, [category, citySlugs, country, title, date]);

  useEffect(() => {
    if (!slugTouched) setSlug(suggested);
  }, [suggested, slugTouched]);

  const toggleCity = (value) =>
    setCitySlugs((current) => (current.includes(value) ? current.filter((c) => c !== value) : [...current, value]));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const meta = { title, date, tags: "", type };
      if (category === "travel") Object.assign(meta, { country, cities: citySlugs.join(",") });
      await api("articles", { method: "POST", body: { category, slug, meta, body: "" } });
      router.push(`/editor/${category}/${slug}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5 border border-[#786f63]/20 bg-white/50 p-6">
      <div className="flex flex-wrap gap-2">
        {[
          ["article", "文章 Article"],
          ["photos", "照片集 Photos"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={[
              "px-4 py-2 text-sm transition-colors",
              type === value ? "bg-[#29251f] text-[#f4efe6]" : "border border-[#786f63]/30 text-[#504a43] hover:bg-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="分類">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="日期">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
        </Field>
      </div>

      <Field label="標題">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder={type === "photos" ? "例如：Lucerne" : "文章標題"} required />
      </Field>

      {category === "travel" && (
        <PlaceFields
          places={places}
          onPlaces={setPlaces}
          country={country}
          citySlugs={citySlugs}
          onCountry={(value) => {
            setCountry(value);
            setCitySlugs([]);
          }}
          onToggleCity={toggleCity}
        />
      )}

      <Field label="文章代號（網址和 R2 資料夾名稱）" hint="小寫英文、數字和連字號">
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={`${inputClass} font-mono`}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
      </Field>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-[#29251f] px-5 py-2.5 text-sm text-[#f4efe6] disabled:opacity-50">
          {saving ? "建立中…" : "建立"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm text-[#6b645a] hover:text-[#29251f]">
          取消
        </button>
      </div>
    </form>
  );
}

export default function EditorHome({ token, categories, countries, cities }) {
  const [articles, setArticles] = useState(null);
  const [filter, setFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 用手機帶 token 進來時存成 cookie，之後的頁面和 API 就不用再帶
    if (token) document.cookie = `editor_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
    api("articles")
      .then((data) => setArticles(data.articles))
      .catch((err) => setError(err.message));
  }, [token]);

  const visible = (articles || []).filter((article) => filter === "all" || article.category === filter);

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968]">Local only</p>
          <h1 className="mt-3 font-serif text-5xl text-[#29251f]">Editor</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/editor/unused" className="border border-[#786f63]/30 px-4 py-2.5 text-sm text-[#504a43] hover:bg-white">
            未使用的檔案
          </Link>
          <button type="button" onClick={() => setCreating(true)} className="bg-[#29251f] px-4 py-2.5 text-sm text-[#f4efe6]">
            ＋ 新增
          </button>
        </div>
      </div>

      {creating && <NewArticleForm categories={categories} countries={countries} cities={cities} onCancel={() => setCreating(false)} />}

      <div className="mt-10 flex flex-wrap gap-5 border-b border-[#786f63]/20 pb-3 text-sm">
        {["all", ...categories].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={filter === value ? "text-[#29251f] underline underline-offset-8" : "text-[#9a8f80] hover:text-[#29251f]"}
          >
            {value === "all" ? "全部" : value}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}
      {!articles && !error && <p className="mt-6 text-sm text-[#9a8f80]">載入中…</p>}

      <ul className="divide-y divide-[#786f63]/15">
        {visible.map((article) => (
          <li key={`${article.category}/${article.slug}`}>
            <Link href={`/editor/${article.category}/${article.slug}`} className="group flex items-baseline gap-4 py-4">
              <span className="w-24 shrink-0 text-xs tabular-nums text-[#9a8f80]">{article.date}</span>
              <span className="min-w-0 flex-1 truncate font-serif text-lg text-[#29251f] group-hover:text-[#456b9b]">{article.title}</span>
              {article.type === "photos" && <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4896b]">Photos</span>}
              <span className="hidden font-mono text-xs text-[#9a8f80] sm:inline">
                {article.category}/{article.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
