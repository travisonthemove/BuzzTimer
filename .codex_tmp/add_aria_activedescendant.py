from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
text = text.replace('role="radiogroup" aria-label="Theme selector"', 'role="radiogroup" aria-label="Theme selector" aria-activedescendant=""')
path.write_text(text, encoding="utf-8")