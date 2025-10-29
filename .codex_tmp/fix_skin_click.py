from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
text = text.replace("        option.addEventListener('click', (event) => {\n            event.stopPropagation();\n\n                        selectSkinOption(option);", "        option.addEventListener('click', (event) => {\n            event.stopPropagation();\n            focusSkinOption(index);\n            selectSkinOption(option);")
text = text.replace('skinOptions.indexOf(option)', 'skinOptions.indexOf(event.currentTarget)')
text = text.replace('selectSkinOption(option);\n                hideElement(skinSelector);\n                timerContainer.focus();', 'selectSkinOption(option);\n                hideElement(skinSelector);\n                timerContainer.focus();')
path.write_text(text, encoding='utf-8')