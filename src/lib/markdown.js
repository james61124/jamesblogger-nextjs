export function parseFrontmatter(raw) {
  const match = raw.match(/^---([\s\S]*?)---/);
  if (!match) return { metadata: {}, body: raw };

  const metadata = match[1].split("\n").reduce((acc, line) => {
    const [key, ...value] = line.split(":");
    if (key && value.length) acc[key.trim()] = value.join(":").trim();
    return acc;
  }, {});

  return { metadata, body: raw.replace(match[0], "").trim() };
}

export function calculateReadTime(content) {
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
}
