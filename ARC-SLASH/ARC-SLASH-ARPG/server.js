import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 8080;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('400 Bad Request');
  }

  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Strip leading /ARC-SLASH-ARPG prefix if accessed via subfolder route
  if (pathname.startsWith('/ARC-SLASH-ARPG')) {
    pathname = pathname.substring('/ARC-SLASH-ARPG'.length) || '/';
  }

  if (pathname === '/' || pathname.endsWith('/')) {
    pathname = path.join(pathname, 'index.html');
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`⚔️  Arc Slash ARPG server running at: http://localhost:${PORT}/`);
});
