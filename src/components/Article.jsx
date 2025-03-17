"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
// import ShareAndCopy from "@/components/ShareAndCopy";

export default function Article() {
  const { category, fileName } = useParams();
  const searchParams = useSearchParams();
  const jsonPath = searchParams.get("json_path");
  const title = searchParams.get("title");

  const file = `/article/${category}/${fileName}.md`;

  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then((data) => {
        const metaMatch = data.match(/^---([\s\S]*?)---/);
        if (metaMatch) {
          const meta = metaMatch[1].split("\n").reduce((acc, line) => {
            const [key, ...value] = line.split(":");
            if (key && value) acc[key.trim()] = value.join(":").trim();
            return acc;
          }, {});
          setMetadata(meta);
          setContent(data.replace(metaMatch[0], ""));
        } else {
          setContent(data);
        }
      })
      .catch((err) => console.error("Error loading markdown:", err));
  }, [file]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 sm:px-12">
      <main className="w-full max-w-3xl mx-auto py-16">
        {metadata.title && (
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-wide leading-tight text-gray-900 mb-4 mt-16">
              {metadata.title.replace(/['"]/g, '')}
            </h1>
          </header>
        )}

        <div className="text-gray-600 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 text-lg text-center sm:text-left sm:flex-grow">
            {metadata.author && (
              <p className="flex items-center gap-1 text-gray-800">
                👨‍💻 <span>{metadata.author}</span>
              </p>
            )}
            {metadata.date && (
              <p className="flex items-center gap-1 text-gray-800">
                📅 <span>{metadata.date}</span>
              </p>
            )}
            {metadata.readTime && (
              <p className="flex items-center gap-1 text-gray-800">
                ⏱️ <span>{metadata.readTime} min read</span>
              </p>
            )}
          </div>
        </div>

        {metadata.tags && (
          <div className="w-full mt-4 mb-4 text-center">
            <div className="flex flex-wrap gap-2 text-sm justify-center">
              {metadata.tags.split(",").map((tag) => (
                <Link
                  key={tag}
                  href={`/${category}?tag=${encodeURIComponent(tag.trim())}`}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
                >
                  {tag.trim()}
                </Link>
              ))}
            </div>
          </div>
        )}

        {metadata.image && (
          <Image
            src={metadata.image}
            alt="Cover Image"
            width={800}
            height={400}
            className="w-full rounded-lg shadow-lg mb-12"
          />
        )}

        <article className="prose lg:prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={prism}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* <ShareAndCopy /> */}
      </main>
    </div>
  );
}