import re
from pathlib import Path

root = Path("../leetcode")  # 或 Path("你的資料夾")

for path in root.rglob("*.md"):
    text = path.read_text(encoding="utf-8")

    text = re.sub(
        r"^###\s+\*\*(.+?)\*\*$",
        r"## \1",
        text,
        flags=re.MULTILINE,
    )
    text = re.sub(
        r"^####\s+\*\*(.+?)\*\*$",
        r"### \1",
        text,
        flags=re.MULTILINE,
    )

    path.write_text(text, encoding="utf-8")
    print(f"Processed: {path}")