import type { ReactNode } from "react";
import type { ArticleImage } from "./types";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

export function getProperty(
  node: HastNode | undefined,
  key: string
): string | undefined {
  const value = node?.properties?.[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(" ");
  return undefined;
}

export function getText(node: HastNode | undefined): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  return (node.children || []).map(getText).join("").trim();
}

export function getImages(node: HastNode | undefined): ArticleImage[] {
  const result: ArticleImage[] = [];

  const visit = (current?: HastNode) => {
    if (!current) return;

    if (current.tagName === "img") {
      const src = getProperty(current, "src");
      if (src) {
        result.push({
          src,
          alt: getProperty(current, "alt") || "",
          caption:
            getProperty(current, "dataCaption") ||
            getProperty(current, "data-caption"),
        });
      }
    }

    current.children?.forEach(visit);
  };

  visit(node);
  return result;
}

export function unwrapParagraphChildren(children: ReactNode): ReactNode {
  return children;
}
