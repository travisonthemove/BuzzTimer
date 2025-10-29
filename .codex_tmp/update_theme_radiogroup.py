from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

text = text.replace('class="skin-options"', 'class="skin-options" role="radiogroup" aria-label="Theme selector"', 1)
text = text.replace('<div class="skin-option active"', '<button class="skin-option active" type="button" role="radio" aria-checked="true" tabindex="0"', 1)
count = 0
parts = text.split('<div class="skin-option"')
reconstructed = [parts[0]]
for part in parts[1:]:
    replacement = '<button class="skin-option" type="button" role="radio" aria-checked="false" tabindex="-1"' + part
    reconstructed.append(replacement)
text = ''.join(reconstructed)
text = text.replace('</div>\n        <img', '</button>\n        <img')
text = text.replace('</div>\n      </div>', '</button>\n      </div>', 1)
path.write_text(text, encoding='utf-8')