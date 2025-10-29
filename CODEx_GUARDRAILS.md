# Codex Guardrails (Windows)
- **Use PowerShell only.** No CMD one-liners.
- Do **not** embed multi-line code in one command (avoid python -c).
- For any script > 1 line, write UTF-8 (no BOM) files under .codex_tmp\ and execute them.
- For PowerShell code, use single-quoted here-strings.
- For Python, write a .py file then run python <file>.py.
- Force UTF-8 console before runs:
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new(False)
  System.Text.ASCIIEncoding = [Console]::OutputEncoding
- Prefer SVG icons over emoji literals in HTML.
- Print a PLAN + list of files to edit before applying changes.
- Make small, reviewable commits.