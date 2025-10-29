from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
text = text.replace('const skinSelector = document.getElementById(\'skinSelector\');', 'const skinSelector = document.getElementById(\'skinSelector\');\n    const skinOptionsGroup = document.querySelector(\'.skin-options\');')
text = text.replace('const selectSkinOption = (option) => {', 'const selectSkinOption = (option) => {\n        const optionId = option.id || `skin-option-${option.getAttribute(\'data-skin\')}`;\n        option.id = optionId;')
text = text.replace('        return selectedSkin;', '        if (skinOptionsGroup) {\n            skinOptionsGroup.setAttribute(\'aria-activedescendant\', option.id);\n        }\n\n        return selectedSkin;')
text = text.replace('        option.addEventListener(\'keydown\', (event) => {\n            const currentIndex = skinOptions.indexOf(option);', '        option.addEventListener(\'keydown\', (event) => {\n            const currentIndex = skinOptions.indexOf(event.currentTarget);')
path.write_text(text, encoding="utf-8")