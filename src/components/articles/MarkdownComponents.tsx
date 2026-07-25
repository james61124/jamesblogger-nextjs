import type { Components } from "react-markdown";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

import Callout from "./Callout";
import Divider from "./Divider";
import EditorialImage from "./EditorialImage";
import FullWidthImage from "./FullWidthImage";
import Gallery from "./Gallery";
import HeroImage from "./HeroImage";
import ImageCompare from "./ImageCompare";
import PullQuote from "./PullQuote";
import Quote from "./Quote";
import SideNote from "./SideNote";
import ThreeImages from "./ThreeImages";
import TwoImages from "./TwoImages";
import Video from "./Video";
import { getImages, getProperty, getText } from "./markdownNodeUtils";


function textOf(children: unknown): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    (children as { props?: { children?: unknown } }).props?.children
  ) {
    return textOf(
      (children as { props: { children: unknown } }).props.children
    );
  }
  return "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const markdownComponents: Components = {
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
    const hastNode = node as {
      children?: Array<{ tagName?: string }>;
    };

    const isImageOnly =
      hastNode?.children?.length === 1 &&
      hastNode.children[0]?.tagName === "img";

    if (isImageOnly) return <>{children}</>;

    return (
      <p
        className="mb-6 font-serif text-[1.08rem] leading-[2] text-[#504a43] sm:text-[1.12rem]"
        {...props}
      >
        {children}
      </p>
    );
  },

  strong: ({ children, ...props }) => (
    <strong className="font-bold text-[#39342e]" {...props}>
      {children}
    </strong>
  ),

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
    <EditorialImage
      src={typeof src === "string" ? src : ""}
      alt={typeof alt === "string" ? alt : ""}
    />
  ),

  div: ({ node, className, children, ...props }) => {
    const hastNode = node as never;
    const classes = String(className || "").split(/\s+/);
    const images = getImages(hastNode);

    if (classes.includes("quote")) {
      return (
        <Quote author={getProperty(hastNode, "dataAuthor") || getProperty(hastNode, "data-author")}>
          {children}
        </Quote>
      );
    }

    if (classes.includes("pullquote")) {
      return <PullQuote>{children}</PullQuote>;
    }

    if (classes.includes("divider")) {
      const variant =
        (getProperty(hastNode, "dataVariant") ||
          getProperty(hastNode, "data-variant") ||
          "dots") as "dots" | "line" | "star";
      return <Divider variant={variant} />;
    }

    if (classes.includes("hero-image") && images[0]) {
      return <HeroImage {...images[0]} />;
    }

    if (classes.includes("full-width-image") && images[0]) {
      return <FullWidthImage {...images[0]} />;
    }

    if (classes.includes("gallery")) {
      return <Gallery images={images} />;
    }

    if (classes.includes("two-images")) {
      return <TwoImages images={images} />;
    }

    if (classes.includes("three-images")) {
      return <ThreeImages images={images} />;
    }

    if (classes.includes("callout")) {
      const tone =
        (getProperty(hastNode, "dataTone") ||
          getProperty(hastNode, "data-tone") ||
          "neutral") as "blue" | "green" | "neutral";
      const title =
        getProperty(hastNode, "dataTitle") ||
        getProperty(hastNode, "data-title");

      return (
        <Callout tone={tone} title={title}>
          {children}
        </Callout>
      );
    }

    if (classes.includes("side-note")) {
      const label =
        getProperty(hastNode, "dataLabel") ||
        getProperty(hastNode, "data-label") ||
        "Note";
      return <SideNote label={label}>{children}</SideNote>;
    }

    if (classes.includes("image-compare") && images.length >= 2) {
      return <ImageCompare before={images[0]} after={images[1]} />;
    }

    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },

  video: ({ node, ...props }) => {
    const hastNode = node as never;
    const src =
      getProperty(hastNode, "src") ||
      getProperty(hastNode, "dataSrc") ||
      getProperty(hastNode, "data-src") ||
      "";
    const caption =
      getProperty(hastNode, "dataCaption") ||
      getProperty(hastNode, "data-caption");
    const poster = getProperty(hastNode, "poster");

    return <Video src={src} caption={caption} poster={poster} />;
  },

  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const value = String(children).replace(/\n$/, "");

    if (match) {
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
      className="my-10 border-l-2 border-[#8a7e70]/35 pl-6 font-serif text-xl italic leading-9 text-[#5d554b]"
      {...props}
    >
      {children}
    </blockquote>
  ),

  hr: () => <Divider />,

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
    <li className="pl-1" {...props}>
      {children}
    </li>
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
};
