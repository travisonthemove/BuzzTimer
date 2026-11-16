import http.client
import importlib.util
import threading
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('preview', Path(__file__).resolve().parents[1] / 'start_server.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)


class PreviewBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = preview.http.server.ThreadingHTTPServer(('127.0.0.1', 0), preview.PreviewHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request(self, path, method='GET'):
        connection = http.client.HTTPConnection(*self.server.server_address)
        connection.request(method, path)
        response = connection.getresponse()
        status, headers, body = response.status, dict(response.getheaders()), response.read()
        connection.close()
        return status, headers, body

    def test_public_assets_and_pages_prefix(self):
        for path in ['/', '/BuzzTimer/', '/BuzzTimer/script.js', '/privacy.html', '/static/vendor/popper-2.11.8.min.js']:
            with self.subTest(path=path):
                status, headers, body = self.request(path)
                self.assertEqual(status, 200)
                self.assertTrue(body)
                self.assertNotIn('Access-Control-Allow-Origin', headers)
                self.assertEqual(headers['X-Content-Type-Options'], 'nosniff')

    def test_repository_files_and_traversal_are_not_served(self):
        for path in ['/.git/config', '/node_modules/tippy.js/package.json', '/.metadata/.log',
                     '/.codex_tmp/apply_hardening.py', '/package.json', '/static/',
                     '/static/vendor/../../../package.json', '/static/vendor/..%5c..%5c..%5cpackage.json',
                     '/static/vendor/../../tools/vendor-runtime.js',
                     '/static/vendor/..%5c..%5ctools%5cvendor-runtime.js',
                     '/static/vendor/%252e%252e/%252e%252e/tools/vendor-runtime.js',
                     '/BuzzTimer/.git/config', '/%2e%2e/package.json']:
            for method in ['GET', 'HEAD']:
                with self.subTest(path=path, method=method):
                    self.assertEqual(self.request(path, method)[0], 404)

    def test_post_cannot_change_files(self):
        self.assertEqual(self.request('/index.html', 'POST')[0], 501)


if __name__ == '__main__':
    unittest.main()
