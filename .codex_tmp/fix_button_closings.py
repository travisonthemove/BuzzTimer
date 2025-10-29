from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
text = text.replace('</div>\n        <button', '</button>\n        <button')
text = text.replace('</div>\n      </div>', '</button>\n      </div>')
path.write_text(text, encoding="utf-8")