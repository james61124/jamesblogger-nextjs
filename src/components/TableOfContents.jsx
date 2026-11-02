"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 標題距離畫面頂端多少以內就算「正在讀」，跟標題的 scroll-mt-28 差不多
const ACTIVE_OFFSET = 140;

export default function TableOfContents({ containerRef, content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  // 直接從渲染好的文章抓 h2 / h3，id 一定跟標題一致
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let chapter = 0;
    const found = [...container.querySelectorAll("h2[id], h3[id]")]
      .filter((el) => el.id)
      .map((el) => {
        const level = el.tagName === "H3" ? 3 : 2;
        if (level === 2) chapter += 1;
        return { id: el.id, text: el.textContent.trim(), level, chapter };
      });

    setHeadings(found);
  }, [containerRef, content]);

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;

      let current = "";
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActiveId(current);

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const ratio = scrollable > 0 ? -rect.top / scrollable : 1;
        setProgress(Math.round(Math.min(1, Math.max(0, ratio)) * 100));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [headings, containerRef]);

  if (headings.length === 0) return null;

  const handleClick = (event, id) => {
    event.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Table of contents">
      <div className="flex items-baseline justify-between pr-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b7f70]">
          Contents
        </p>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.1em] text-[#a3988a]">
          {progress}%
        </span>
      </div>

      <ol className="mt-6 max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-2">
        {headings.map(({ id, text, level, chapter }) => {
          const active = id === activeId;
          return (
            <li key={id} className="relative">
              {active && (
                <motion.span
                  layoutId="toc-active"
                  aria-hidden
                  className="absolute left-0 top-[0.95rem] h-px w-3 bg-[#456b9b]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                aria-current={active ? "location" : undefined}
                className="group flex gap-3 py-1.5 pl-5"
              >
                {level === 2 ? (
                  <span
                    className={[
                      "w-4 shrink-0 pt-[3px] font-mono text-[10px] tabular-nums transition-colors duration-300",
                      active ? "text-[#456b9b]" : "text-[#b0a598]",
                    ].join(" ")}
                  >
                    {String(chapter).padStart(2, "0")}
                  </span>
                ) : (
                  <span className="w-4 shrink-0" />
                )}
                <span
                  className={[
                    "font-serif leading-5 transition-all duration-300 ease-out",
                    level === 3 ? "text-[13px]" : "text-sm",
                    active
                      ? "translate-x-0.5 text-[#29251f]"
                      : "text-[#8a8073] group-hover:translate-x-0.5 group-hover:text-[#3c3730]",
                  ].join(" ")}
                >
                  {text}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
