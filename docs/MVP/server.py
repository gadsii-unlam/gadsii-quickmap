#!/usr/bin/env python3
"""
QuickMap MVP - Servidor HTTP Local
Permite levantar la aplicación web localmente de forma rápida sin dependencias externas.

Uso:
    python server.py [--port 8000] [--no-browser]
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import argparse

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Manejador con tipos MIME correctos para módulos ES6 y JSON"""
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.html': 'text/html; charset=utf-8',
    }

    def end_headers(self):
        # Habilitar CORS y evitar caché en desarrollo local
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server(port=8000, open_browser=True):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    # Intentar puertos sucesivos si el 8000 está ocupado
    max_attempts = 10
    httpd = None
    actual_port = port

    for i in range(max_attempts):
        actual_port = port + i
        try:
            # Reutilizar dirección para evitar Address Already In Use
            socketserver.TCPServer.allow_reuse_address = True
            httpd = socketserver.TCPServer(("", actual_port), QuietHandler)
            break
        except OSError:
            continue

    if not httpd:
        print(f"Error: No se pudo enlazar ningún puerto entre {port} y {port + max_attempts - 1}")
        sys.exit(1)

    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    url = f"http://localhost:{actual_port}/"
    print("=" * 60)
    print("  [*] QuickMap MVP - Servidor Local Iniciado")
    print("=" * 60)
    print(f"  Directorio raiz: {base_dir}")
    print(f"  URL de acceso:   {url}")
    print("  Presiona Ctrl+C para detener el servidor.")
    print("=" * 60)

    if open_browser:
        try:
            webbrowser.open(url)
        except Exception as e:
            print(f"  (Aviso: No se pudo abrir el navegador automáticamente: {e})")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDeteniendo servidor QuickMap...")
        httpd.server_close()
        sys.exit(0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Servidor local para QuickMap MVP')
    parser.add_argument('--port', type=int, default=8000, help='Puerto inicial (default: 8000)')
    parser.add_argument('--no-browser', action='store_true', help='No abrir el navegador automáticamente')
    args = parser.parse_args()

    run_server(port=args.port, open_browser=not args.no_browser)
