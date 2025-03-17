import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import ShareAndCopy from "./ShareAndCopy";


export default function Article({ category }) {
  const { fileName } = useParams();
  const file = `/article/${category}/${fileName}.md`;
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState({});
  const [headings, setHeadings] = useState([]);

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
    <div
      className="min-h-screen bg-white flex flex-col items-center px-6 sm:px-12"
    >
      {/* 主要內容區域 */}
      <main className="w-full max-w-3xl mx-auto py-16">
        {/* Metadata Header */}
        {metadata.title && (
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-wide leading-tight text-gray-900 mb-4 mt-16">
              {metadata.title.replace(/['"]/g, '')}
            </h1>
          </header>
        )}

        <div className="text-gray-600 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Author | Date | Read Time */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 text-lg text-center sm:text-left sm:flex-grow">
            {metadata.author && (
              <p className="flex items-center gap-1 text-gray-800">
                <span role="img" aria-label="author">👨‍💻</span>
                <span>{metadata.author}</span>
              </p>
            )}
            {metadata.date && (
              <p className="flex items-center gap-1 text-gray-800">
                <span role="img" aria-label="date">📅</span>
                <span>{metadata.date}</span>
              </p>
            )}
            {metadata.readTime && (
              <p className="flex items-center gap-1 text-gray-800">
                <span>⏱️</span>
                <span>{metadata.readTime} min read</span>
              </p>
            )}
          </div>

          {/* Tags (Move this below the other items) */}
        </div>

        {/* Tags should be placed outside to ensure correct positioning */}
        {metadata.tags && (
          <div className="w-full mt-4 mb-4 text-center">
            <div className="flex flex-wrap gap-2 text-sm justify-center">
              {metadata.tags.split(",").map((tag) => (
                <Link
                  key={tag}
                  to={`/${category}?tag=${encodeURIComponent(tag.trim())}`} 
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
                >
                  {tag.trim()}
                </Link>
              ))}
            </div>
          </div>
        )}

        {metadata.image && (
          <img
            src={`${metadata.image}`}
            alt="Cover Image"
            className="w-full rounded-lg shadow-lg mb-12"
          />
        )}

        <article className="prose lg:prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-5xl sm:text-5xl font-bold tracking-wide mb-8 text-gray-900"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl sm:text-3xl font-semibold tracking-wide my-4 text-gray-800"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl sm:text-2xl font-medium my-3 text-gray-700"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h3
                  className="text-xl sm:text-xl font-medium my-3 text-gray-700"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-lg leading-relaxed mb-6 text-gray-800" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="relative text-gray-800 hover:text-gray-900 transition-colors duration-300 ease-in-out
                            after:content-[''] after:absolute after:bottom-[-2px] after:left-0 
                            after:w-full after:h-[2px] after:bg-gray-400 after:scale-x-100 
                            after:transition-all after:duration-300 after:ease-in-out 
                            hover:after:bg-gray-800 hover:after:scale-x-100"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="bg-gray-200 text-sm text-black px-1 py-0.5 shadow-sm"
                  {...props}
                />
              ),
              pre: ({ node, children, ...props }) => {
                const codeContent = node.children[0].children[0].value;
                const languageClass = node.children[0].properties.className?.[0] || "";
                const language = languageClass.replace("language-", "") || "plaintext"; // 預設為純文字

                return (
                  <div className="relative">
                    <SyntaxHighlighter
                      language={language}
                      style={prism} // 亮色主題
                      className="p-4" // 只保留內距，移除圓角
                      customStyle={{
                        background: "transparent", // 透明背景
                        borderRadius: "0px", // 移除圓角
                        padding: "16px", // 內距
                        border: "1px solid #ddd", // 添加邊框
                        fontSize: "14px", // 調整字體大小
                      }}
                    >
                      {codeContent}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 text-gray-600 my-6">
                  {props.children}
                </blockquote>
              ),
              hr: () => <hr className="my-12 border-t border-gray-300" />,
              ul: ({ node, ...props }) => (
                <ul className="list-disc text-lg list-outside space-y-2 pl-5 text-gray-800" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal text-lg list-outside space-y-2 pl-5 text-gray-800" {...props} />
              ),
              li: ({ node, children, ...props }) => {
                if (
                  Array.isArray(children) &&
                  children.length === 1 &&
                  typeof children[0] === "object" &&
                  children[0].type === "p"
                ) {
                  return <li className="leading-relaxed text-lg list-item" {...props}>{children[0].props.children}</li>;
                }
                return <li className="leading-relaxed text-lg list-item" {...props}>{children}</li>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <ShareAndCopy />

      </main>
    </div>
  );
}
