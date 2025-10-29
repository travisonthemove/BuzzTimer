from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
old = "            focusFirst: () => entertainmentModal.querySelector('.modal-content').focus(),"
new = "            focusFirst: () => {\n                const closeBtn = entertainmentModal.querySelector('.modal-close');\n                if (closeBtn) {\n                    closeBtn.focus();\n                } else {\n                    entertainmentModal.focus();\n                }\n            },"
text = text.replace(old, new)
path.write_text(text, encoding='utf-8')