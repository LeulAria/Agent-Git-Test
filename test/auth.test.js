import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { postJson, startApp } from './helpers.js';

let app;
before(async () => {
	app = await startApp();
});
after(() => app.close());

test('rejects a wrong password', async () => {
	const res = await postJson(`${app.url}/api/login`, { username: 'demo', password: 'nope' });
	assert.equal(res.status, 401);
});

test('/api/me needs a session', async () => {
	const res = await fetch(`${app.url}/api/me`);
	assert.equal(res.status, 401);
});
