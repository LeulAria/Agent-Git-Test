import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { postJson, startApp } from './helpers.js';

let app;
before(async () => {
	app = await startApp();
});
after(() => app.close());

test('creates and lists notes', async () => {
	const res = await postJson(`${app.url}/api/notes`, { title: 'Groceries', body: 'eggs, milk' });
	assert.equal(res.status, 201);
	const created = await res.json();
	assert.equal(created.title, 'Groceries');

	const list = await (await fetch(`${app.url}/api/notes`)).json();
	assert.ok(list.some(note => note.id === created.id && note.title === 'Groceries'));
});

test('gets one note with its body', async () => {
	const created = await (await postJson(`${app.url}/api/notes`, { title: 'Ideas', body: 'ship it' })).json();
	const note = await (await fetch(`${app.url}/api/notes/${created.id}`)).json();
	assert.equal(note.body, 'ship it');
});

test('unknown note is a 404', async () => {
	const res = await fetch(`${app.url}/api/notes/99999`);
	assert.equal(res.status, 404);
});

test('malformed JSON is a 400', async () => {
	const res = await fetch(`${app.url}/api/notes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{oops' });
	assert.equal(res.status, 400);
});

test('updates and deletes a note', async () => {
	const created = await (await postJson(`${app.url}/api/notes`, { title: 'Draft', body: '' })).json();
	const patched = await fetch(`${app.url}/api/notes/${created.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Final' }) });
	assert.equal((await patched.json()).title, 'Final');
	const removed = await fetch(`${app.url}/api/notes/${created.id}`, { method: 'DELETE' });
	assert.equal(removed.status, 204);
});
