from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
old = "    themeToggle.addEventListener('click', () => {\n        if (skinSelector.classList.contains('hidden')) {\n            showElement(skinSelector);\n            skinSelector.focus(); // Focus the panel now that it's visible\n        } else {\n            hideElement(skinSelector);\n            timerContainer.focus();\n        }\n        console.log(\"Theme selector toggled\");\n    });\n"
new = "    themeToggle.addEventListener('click', () => {\n        const isHidden = skinSelector.classList.contains('hidden');\n        if (isHidden) {\n            showElement(skinSelector);\n            skinSelector.classList.remove('hidden');\n            skinSelector.setAttribute('aria-hidden', 'false');\n            const activeIndex = skinOptions.findIndex(btn => btn.classList.contains('active')) || 0;\n            focusSkinOption(activeIndex);\n        } else {\n            hideElement(skinSelector);\n            skinSelector.classList.add('hidden');\n            skinSelector.setAttribute('aria-hidden', 'true');\n            timerContainer.focus();\n        }\n        themeToggle.setAttribute('aria-expanded', (!isHidden).toString());\n        console.log('Theme selector toggled');\n    });\n"
text = text.replace(old, new)
path.write_text(text, encoding='utf-8')