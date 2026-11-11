/**
 * Local preview server for the static export in `out/`.
 *
 * Next.js is configured with `output: 'export'`, so `next start` cannot serve
 * the build. Opening `out/index.html` directly with a file:// URL also fails,
 * because browsers block the absolute `/_next/...` asset paths in that mode.
 *
 * Usage:
 *   npm run build
 *   npm run preview
 *
 * Then open http://localhost:4173
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'out');
const startPort = Number(process.env.PORT || 4173);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function resolveFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  let file = path.join(root, decoded);
  if (file !== root && !file.startsWith(root + path.sep)) return null;

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  } else if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) {
    file = `${file}.html`;
  } else if (!fs.existsSync(file) && fs.existsSync(path.join(file, 'index.html'))) {
    file = path.join(file, 'index.html');
  }

  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

if (!fs.existsSync(root)) {
  console.error('\nStatic build not found. Run "npm run build" first.\n');
  process.exit(1);
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = resolveFile(pathname);

  if (!file) {
    const notFound = path.join(root, '404.html');
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (fs.existsSync(notFound)) fs.createReadStream(notFound).pipe(response);
    else response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  fs.createReadStream(file).pipe(response);
});

function listen(port, attemptsLeft = 10) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    console.error(`Preview server failed: ${error.message}`);
    process.exit(1);
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`\nSan Private High School — static preview`);
    console.log(`Serving: ${root}`);
    console.log(`Open:    http://localhost:${port}\n`);
    console.log('Do not open out/index.html directly from disk.');
    console.log('Press Ctrl+C to stop.\n');
  });
}

listen(startPort);
