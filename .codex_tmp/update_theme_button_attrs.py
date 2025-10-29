from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
text = text.replace('<button id="themeToggle"', '<button id="themeToggle" aria-controls="skinSelector" aria-expanded="false"', 1)
text = text.replace('<div id="skinSelector"', '<div id="skinSelector" class="hidden" tabindex="-1" aria-hidden="true"', 1)
path.write_text(text, encoding="utf-8")