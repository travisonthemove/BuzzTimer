from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
text = text.replace('data-tippy-content="Switch between light mode and dark mode."', 'data-tippy-content="Switch between light mode and dark mode."')
text = text.replace('aria-label="Switch to Light Mode"', 'aria-label="Switch to light mode"')
path.write_text(text, encoding="utf-8")