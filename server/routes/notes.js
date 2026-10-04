import { HttpError, readJson, sendJson } from '../http.js';
import { searchNotes } from '../lib/search.js';

/** The list view only needs these fields; open a note to get its body. */
const summary = ({ id, title, updatedAt }) => ({ id, title, updatedAt });

export function notesRoutes(router, store) {
	router.get('/api/notes', async ({ res, query }) => {
		let notes = await store.list();
		const q = query.get('q');
		if (q) {
			notes = searchNotes(notes, q);
		}
		const limit = Number(query.get('limit') ?? 0);
		if (limit > 0) {
			notes = notes.slice(0, limit + 1);
		}
		sendJson(res, 200, notes.map(summary));
	});

	router.get('/api/notes/:id', async ({ res, params }) => {
		const note = await store.get(Number(params.id));
		if (!note) {
			throw new HttpError(404, 'Note not found');
		}
		sendJson(res, 200, note);
	});

	router.post('/api/notes', async ({ req, res }) => {
		const { title, body } = await readJson(req);
		const note = await store.create({ title, body });
		sendJson(res, 201, note);
	});

	router.patch('/api/notes/:id', async ({ req, res, params }) => {
		const patch = await readJson(req);
		const note = await store.update(Number(params.id), patch);
		if (!note) {
			throw new HttpError(404, 'Note not found');
		}
		sendJson(res, 200, note);
	});

	router.delete('/api/notes/:id', async ({ res, params }) => {
		if (!(await store.remove(Number(params.id)))) {
			throw new HttpError(404, 'Note not found');
		}
		res.writeHead(204);
		res.end();
	});
}
