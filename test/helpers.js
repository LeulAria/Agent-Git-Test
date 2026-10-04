import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../server/index.js';

/** Starts the app on a random port with its own empty data file. */
export async function startApp(seed = []) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pulse-notes-'));
	const dataFile = path.join(dir, 'notes.json');
	await fs.writeFile(dataFile, JSON.stringify(seed));
	const { server, store } = createApp({ dataFile });
	await new Promise(resolve => server.listen(0, resolve));
	const url = `http://localhost:${server.address().port}`;
	return {
		url,
		store,
		dataFile,
		async close() {
			await new Promise(resolve => server.close(resolve));
			await fs.rm(dir, { recursive: true, force: true });
		},
	};
}

export async function postJson(url, body) {
	return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}
