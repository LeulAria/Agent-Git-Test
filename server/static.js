import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../web');

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
};

export async function serveStatic(req, res) {
	const url = new URL(req.url, 'http://localhost');
	const relative = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
	const file = path.resolve(ROOT, relative);
	if (!file.startsWith(ROOT + path.sep) || req.method !== 'GET') {
		res.writeHead(404, { 'content-type': 'text/plain' });
		res.end('Not found');
		return;
	}
	try {
		const data = await fs.readFile(file);
		res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
		res.end(data);
	} catch {
		res.writeHead(404, { 'content-type': 'text/plain' });
		res.end('Not found');
	}
}
