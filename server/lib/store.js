import fs from 'node:fs/promises';
import path from 'node:path';

/** Notes live in one JSON file. Every operation reads the file and writes it back. */
export class NoteStore {
	constructor(file) {
		this.file = file;
	}

	async load() {
		try {
			return JSON.parse(await fs.readFile(this.file, 'utf8'));
		} catch (err) {
			if (err.code === 'ENOENT') {
				return [];
			}
			throw err;
		}
	}

	async save(notes) {
		await fs.mkdir(path.dirname(this.file), { recursive: true });
		await fs.writeFile(this.file, JSON.stringify(notes, null, 2));
	}

	async list() {
		return this.load();
	}

	async get(id) {
		return (await this.load()).find(note => note.id === id);
	}

	async create({ title, body = '' }) {
		const notes = await this.load();
		const now = Date.now();
		const note = { id: notes.length + 1, title, body, createdAt: now, updatedAt: now };
		notes.push(note);
		await this.save(notes);
		return note;
	}

	async update(id, patch) {
		const notes = await this.load();
		const note = notes.find(n => n.id === id);
		if (!note) {
			return undefined;
		}
		if (patch.title !== undefined) {
			note.title = patch.title;
		}
		if (patch.body !== undefined) {
			note.body = patch.body;
		}
		note.updatedAt = Date.now();
		await this.save(notes);
		return note;
	}

	async remove(id) {
		const notes = await this.load();
		const index = notes.findIndex(n => n.id === id);
		if (index === -1) {
			return false;
		}
		notes.splice(index, 1);
		await this.save(notes);
		return true;
	}
}
