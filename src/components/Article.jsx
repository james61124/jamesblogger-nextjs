"use client";

import { useEffect, useMemo, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
import Link from "next/link";
import Image from "next/image";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import ShareAndCopy from "@/components/ShareAndCopy";
import MarkdownRenderer from "@/components/article/MarkdownRenderer";

function parseFrontmatter(raw) {
  const match = raw.match(/^---([\s\S]*?)---/);
  if (!match) return { metadata: {}, body: raw };

  const metadata = match[1].split("\n").reduce((acc, line) => {
    const [key, ...value] = line.split(":");
    if (key && value.length) acc[key.trim()] = value.join(":").trim();
    return acc;
  }, {});

  return { metadata, body: raw.replace(match[0], "").trim() };
}

function clean(value) {
  return typeof value === "string" ? value.replace(/^['"]|['"]$/g, "") : value;
}

function textOf(children) {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  return children?.props?.children ? textOf(children.props.children) : "";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Article({ category, fileName, json_path, title }) {
  const file = `/article/${category}/${fileName}.md`;
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`Unable to load article (${res.status})`);
        return res.text();
      })
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseFrontmatter(raw);
        setMetadata(parsed.metadata);
        setContent(parsed.body);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("This story could not be loaded.");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [file]);

  const meta = useMemo(
    () => Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, clean(v)])),
    [metadata]
  );

  const tags = useMemo(
    () =>
      meta.tags
        ? String(meta.tags).split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
    [meta.tags]
  );

  const calculatedReadTime = useMemo(() => {
  if (!content) return 1;

  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const chineseCharacters =
    plainText.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g)?.length ?? 0;

  const nonChineseText = plainText.replace(
    /[\u3400-\u4dbf\u4e00-\u9fff]/g,
    " "
  );

  const englishWords =
    nonChineseText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;

  const minutes =
    chineseCharacters / 450 +
    englishWords / 220;

  return Math.max(1, Math.ceil(minutes));
}, [content]);

  const articleTitle = meta.title || title || "Untitled Story";
  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Journal";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4efe6] px-6 pt-36">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mx-auto h-3 w-36 bg-black/10" />
          <div className="mx-auto mt-7 h-12 w-3/4 bg-black/10" />
          <div className="mx-auto mt-5 h-4 w-52 bg-black/10" />
          <div className="mt-14 aspect-[16/9] bg-black/10" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4efe6] px-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a7d6c]">
            Personal Journal
          </p>
          <h1 className="mt-5 font-serif text-4xl text-[#2d2924]">{error}</h1>
          <Link
            href={`/${category}`}
            className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.15em] text-[#4c6790]"
          >
            Back to stories →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe6] px-5 pb-28 pt-32 sm:px-8 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.12) 0.65px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />

      <div className="relative mx-auto max-w-[1260px]">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#867968]">
            {categoryLabel} Journal
          </p>

          <h1 className="mt-5 font-serif text-[2.8rem] font-normal leading-[1.02] tracking-[-0.045em] text-[#29251f] sm:text-[3.8rem] lg:text-[4.5rem]">
            {articleTitle}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] uppercase tracking-[0.14em] text-[#776f64]">
            {meta.date && <span>{meta.date}</span>}
            {meta.date && <span>·</span>}
            <span>{calculatedReadTime} min read</span>
            {tags[0] && <span>·</span>}
            {tags[0] && <span className="text-[#476b9a]">{tags[0]}</span>}
          </div>

          {tags.length > 1 && (
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {tags.slice(1).map((tag, index) => (
                <Link
                  key={`${tag}-${index}`}
                  href={{
                    pathname: `/${category}/tags`,
                    query: { json_path, title, category, tag },
                  }}
                  className="text-[12px] text-[#81786c] transition-colors hover:text-[#456b9b]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mx-auto mt-7 h-px w-20 bg-[#7a7062]/25" />
        </header>

        {meta.image && (
          <div className="mx-auto mt-8 max-w-6xl">
            <Image
              src={meta.image}
              alt={articleTitle}
              width={1800}
              height={1200}
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="h-auto w-full rounded-xl shadow-[0_18px_50px_rgba(60,48,31,0.10)]"
            />
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-[1160px] grid-cols-1 gap-14 lg:grid-cols-[180px_minmax(0,760px)_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b7f70]">
                Story
              </p>
              <div className="mt-5 h-px w-10 bg-[#7d7366]/25" />
              <p className="mt-5 font-serif text-sm italic leading-6 text-[#746c61]">
                Travel Notes
              </p>
            </div>
          </aside>

          <article className="min-w-0">
            <MarkdownRenderer content={content} />
            {/* <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                strong: ({ children }) => {
                  return (
                    <strong className="font-bold text-[#1f1c18]">
                      {children}
                    </strong>
                  );
                },
                h1: ({ children, ...props }) => (
                  <h1
                    id={slugify(textOf(children))}
                    className="mb-8 mt-16 scroll-mt-28 font-serif text-4xl font-normal leading-tight tracking-[-0.025em] text-[#29251f] sm:text-5xl"
                    {...props}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    id={slugify(textOf(children))}
                    className="mb-6 mt-16 scroll-mt-28 font-serif text-[2.35rem] font-normal leading-[1.15] tracking-[-0.025em] text-[#302b25] sm:text-[2.75rem]"
                    {...props}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3
                    id={slugify(textOf(children))}
                    className="mb-4 mt-11 scroll-mt-28 font-serif text-[1.8rem] font-normal leading-tight tracking-[-0.018em] text-[#38322b]"
                    {...props}
                  >
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4
                    className="mb-3 mt-9 text-lg font-semibold text-[#3c3730]"
                    {...props}
                  >
                    {children}
                  </h4>
                ),
                p: ({ node, children, ...props }) => {
                  const isImageOnly =
                    node?.children?.length === 1 &&
                    node.children[0]?.tagName === "img";

                  if (isImageOnly) {
                    // 不要再包一層 <p>
                    return <>{children}</>;
                  }

                  return (
                    <p
                      className="mb-6 font-serif text-[1.08rem] leading-[2] text-[#504a43] sm:text-[1.12rem]"
                      {...props}
                    >
                      {children}
                    </p>
                  );
                },
                a: ({ children, ...props }) => (
                  <a
                    className="text-[#426a9d] underline decoration-[#426a9d]/35 underline-offset-[5px] hover:text-[#2f537e]"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <figure className="my-12">
                    <Image
                      src={src || ""}
                      alt={alt || ""}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 900px) 100vw, 900px"
                      className="h-auto w-full rounded-xl shadow-[0_16px_38px_rgba(60,48,31,0.10)]"
                    />

                    {alt && (
                      <figcaption className="mt-3 text-center font-serif text-sm italic text-[#7d7468]">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const value = String(children).replace(/\n$/, "");

                  if (!inline && match) {
                    return (
                      <div className="my-10 overflow-hidden rounded-xl border border-[#8b8174]/16 bg-[#fbf8f2] shadow-[0_10px_28px_rgba(55,44,29,0.06)]">
                        <div className="border-b border-[#8b8174]/12 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#8a7f72]">
                          {match[1]}
                        </div>
                        <SyntaxHighlighter
                          language={match[1]}
                          style={prism}
                          customStyle={{
                            margin: 0,
                            padding: "22px",
                            background: "transparent",
                            fontSize: "14px",
                            lineHeight: "1.75",
                          }}
                          {...props}
                        >
                          {value}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="rounded bg-[#e8dfd2] px-1.5 py-0.5 font-mono text-[0.88em] text-[#3d3730]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="my-12 bg-[#eee4d5] px-7 py-7 font-serif text-xl italic leading-9 text-[#5d554b] sm:px-9"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <div className="my-16 flex justify-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-[#8a7e70]/40" />
                    <span className="h-1 w-1 rounded-full bg-[#8a7e70]/40" />
                    <span className="h-1 w-1 rounded-full bg-[#8a7e70]/40" />
                  </div>
                ),
                ul: ({ children, ...props }) => (
                  <ul
                    className="mb-7 list-disc space-y-2 pl-6 font-serif text-[1.06rem] leading-8 text-[#514b43] marker:text-[#6782a6]"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="mb-7 list-decimal space-y-2 pl-6 font-serif text-[1.06rem] leading-8 text-[#514b43] marker:text-[#6782a6]"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="pl-1" {...props}>{children}</li>
                ),
                table: ({ children, ...props }) => (
                  <div className="my-10 overflow-x-auto">
                    <table className="w-full border-collapse text-left" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-[#7e7468]/28">{children}</thead>
                ),
                th: ({ children, ...props }) => (
                  <th
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#70675c]"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td
                    className="border-b border-[#7e7468]/14 px-4 py-4 font-serif text-[15px] leading-7 text-[#544e46]"
                    {...props}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown> */}

            <section className="mt-20 border-y border-[#746b5e]/14 py-12 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8a7e70]">
                End of story
              </p>
              <h2 className="mt-5 font-serif text-3xl font-normal tracking-[-0.02em] text-[#302b25]">
                Thanks for reading.
              </h2>
              <p className="mx-auto mt-4 max-w-md font-serif text-base italic leading-7 text-[#70675d]">
                If this story resonated with you, feel free to save it or share it.
              </p>
              <div className="mt-8 flex justify-center">
                <ShareAndCopy />
              </div>
            </section>

            <div className="mt-12">
              <Link
                href={`/${category}`}
                className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#466a98] hover:text-[#2f537e]"
              >
                ← Back to {categoryLabel}
              </Link>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b7f70]">
                Details
              </p>
              <div className="mt-5 space-y-5 font-serif text-sm leading-6 text-[#766d62]">
                {meta.author && <div><p className="text-[10px] uppercase tracking-[0.14em] text-[#9a8f80]">Author</p><p className="mt-1">{meta.author}</p></div>}
                {meta.date && <div><p className="text-[10px] uppercase tracking-[0.14em] text-[#9a8f80]">Published</p><p className="mt-1">{meta.date}</p></div>}
                {meta.readTime && <div><p className="text-[10px] uppercase tracking-[0.14em] text-[#9a8f80]">Reading time</p><p className="mt-1">{calculatedReadTime} minutes</p></div>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
