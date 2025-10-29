from pathlib import Path

html_path = Path("index.html")
text = html_path.read_text(encoding="utf-8")
text = text.replace('<span class="close">&times;</span>', '<button type="button" class="modal-close" aria-label="Close">&times;</button>')
text = text.replace('<div id="logModal" class="modal hidden">', '<div id="logModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="logModalTitle">')
text = text.replace('<h2>Log Moment</h2>', '<h2 id="logModalTitle">Log Moment</h2>', 1)
text = text.replace('<div id="highIdeaModal" class="modal hidden">', '<div id="highIdeaModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="highIdeaModalTitle">')
text = text.replace('<h2>Document Your High Idea</h2>', '<h2 id="highIdeaModalTitle">Document Your High Idea</h2>', 1)
text = text.replace('<div id="entertainmentModal" class="modal entertainment-modal hidden">', '<div id="entertainmentModal" class="modal entertainment-modal hidden" role="dialog" aria-modal="true" aria-labelledby="entertainmentModalTitle">')
text = text.replace('<h2>Entertainment Zone</h2>', '<h2 id="entertainmentModalTitle">Entertainment Zone</h2>', 1)
text = text.replace('<div id="shareModal" class="modal hidden">', '<div id="shareModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="shareModalTitle">')
text = text.replace('<h2>Share Your Session</h2>', '<h2 id="shareModalTitle">Share Your Session</h2>', 1)
html_path.write_text(text, encoding="utf-8")