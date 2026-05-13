#!/usr/bin/env python3
# Tiny static server with SPA fallback: unknown paths return index.html
# so client-side routes like /introducing survive a refresh.

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3005


class SPAHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        if path != '/' and not os.path.exists('.' + path):
            self.path = '/index.html'
        return super().do_GET()


if __name__ == '__main__':
    print(f'Serving on http://localhost:{PORT}')
    HTTPServer(('', PORT), SPAHandler).serve_forever()
