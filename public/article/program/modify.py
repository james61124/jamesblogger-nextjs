import re
from pathlib import Path

path = Path("binary-tree-reconstruction.md")
text = path.read_text(encoding="utf-8")

text = re.sub(r"^###\s+\*\*(.+?)\*\*$", r"## \1", text, flags=re.MULTILINE)
text = re.sub(r"^####\s+\*\*(.+?)\*\*$", r"### \1", text, flags=re.MULTILINE)

path.write_text(text, encoding="utf-8")