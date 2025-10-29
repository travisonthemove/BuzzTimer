from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")
text = text.replace('const darkModeToggle = document.getElementById(\'darkModeToggle\');\n    // ToDo  NEW: Grab the Settings button\n    const settingsBtn = document.getElementById(\'settingsBtn\');\n', 'const darkModeToggle = document.getElementById(\'darkModeToggle\');\n    // ToDo  NEW: Grab the Settings button\n    const settingsBtn = document.getElementById(\'settingsBtn\');\n    const openModals = new Map();\n')
path.write_text(text, encoding='utf-8')