import fs from "fs";
import path from "path";

export const CATEGORY_CONFIG = {
  life: {
    title: "Life Journal",
    json_path: "/metadata/life_metadata.json",
  },
  travel: {
    title: "Journey Memories",
    json_path: "/metadata/travel_metadata.json",
  },
  program: {
    title: "Program Notes",
    json_path: "/metadata/program_metadata.json",
  },
  other: {
    title: "Program Notes",
    json_path: "/metadata/other_metadata.json",
  },
};

const DEFAULT_CONFIG = {
  title: "Default Articles",
  json_path: "/metadata/default_metadata.json",
};

export const CATEGORIES = ["life", "program", "travel", "other"];

export const LEETCODE_JSON_PATH = "/metadata/leetcode_metadata.json";

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
}

export function getArticleFileNames(category) {
  const dirPath = path.join(process.cwd(), "public", "article", category);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).map((file) => path.parse(file).name);
}
