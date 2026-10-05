import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { HttpError, sendJson } from './http.js';
import { log } from './lib/log.js';
import { NoteStore } from './lib/store.js';
import { createRouter } from './router.js';
import { authRoutes } from './routes/auth.js';
import { notesRoutes } from './routes/notes.js';
import { statsRoutes } from './routes/stats.js';
import { serveStatic } from './static.js';

export function createApp({ dataFile = process.env.NOTES_FILE ?? 'data/notes.json' } = {}) {
	const store = new NoteStore(dataFile);
	const router = createRouter();
	notesRoutes(router, store);
	statsRoutes(router, store);
	authRoutes(router);

	const server = http.createServer(async (req, res) => {
		const started = Date.now();
		try {
			if (!(await router.handle(req, res))) {
				await serveStatic(req, res);
			}
		} catch (err) {
			if (err instanceof HttpError) {
				sendJson(res, err.status, { error: err.message });
			} else {
				log.error('request failed', { url: req.url, error: err.message });
				if (!res.headersSent) {
					sendJson(res, 500, { error: 'Internal error' });
				}
			}
		} finally {
			log.debug(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`);
		}
	});
	return { server, store };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const port = Number(process.env.PORT ?? 4310);
	const { server } = createApp();
	server.listen(port, () => log.info(`Ton Notes on http://localhost:${port}`));
}
