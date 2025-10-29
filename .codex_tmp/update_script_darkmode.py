from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")

marker = "    // Dark/Light Mode Toggle"
start = text.index(marker)
replacement = """    const updateDarkModeToggle = () => {
        const isLightMode = document.body.classList.contains('light-mode');
        darkModeToggle.dataset.mode = isLightMode ? 'light' : 'dark';
        darkModeToggle.setAttribute('aria-label', isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode');
        return isLightMode;
    };

    // Dark/Light Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = updateDarkModeToggle();
        console.log(`Light mode is now ${isLight ? 'ON' : 'OFF'}`);
    });

    updateDarkModeToggle();
});
"""

path.write_text(text[:start] + replacement, encoding="utf-8")