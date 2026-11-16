"""Loopback-only preview of public app assets, never the repository directory."""
import argparse
import http.server
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
PUBLIC_FILES = {
    "index.html", "about.html", "privacy.html", "contact.html", "styles.css",
    "script.js", "settingsStore.js", "timerEngine.js", "favicon",
}
STATIC_DIRS = {"icons", "skins", "vendor"}
STATIC_SUFFIXES = {".svg", ".png", ".ico", ".js", ".css"}


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        path = unquote(urlsplit(self.path).path)
        if path in ("/", "/BuzzTimer", "/BuzzTimer/"):
            path = "/index.html"
        elif path.startswith("/BuzzTimer/"):
            path = path[len("/BuzzTimer"):]
        relative = path.lstrip("/")
        candidate = (ROOT / relative).resolve()
        parts = Path(relative).parts
        allowed = relative in PUBLIC_FILES or (
            len(parts) >= 3 and parts[0] == "static" and parts[1] in STATIC_DIRS
            and candidate.suffix.lower() in STATIC_SUFFIXES
            and candidate.is_relative_to(ROOT / "static" / parts[1])
        ) or relative == "static/favicon.ico"
        if not allowed or not candidate.is_relative_to(ROOT) or not candidate.is_file():
            self.send_error(404, "Not found")
            return None
        # Serve the checked path directly; do not decode it a second time.
        self.path = "/" + relative
        self._public_path = str(candidate)
        return super().send_head()

    def translate_path(self, path):
        return self._public_path

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        # Do not write requested URLs or user-supplied query strings to logs.
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    with http.server.ThreadingHTTPServer(("127.0.0.1", args.port), PreviewHandler) as server:
        print(f"BuzzTimer preview: http://127.0.0.1:{server.server_port}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
