from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
text = text.replace('            hideElement(logModal);', '            closeModal(\'log\');')
path.write_text(text, encoding='utf-8')