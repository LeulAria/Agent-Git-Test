import assert from 'node:assert/strict';
import { test } from 'node:test';
import { startApp } from './helpers.js';

test('stats count notes, words and duplicate titles', async () => {
	const day = Date.UTC(2026, 2, 10, 12);
	const app = await startApp([
		{ id: 1, title: 'Pizza night', body: 'one two three', createdAt: day, updatedAt: day },
		{ id: 2, title: 'pizza  NIGHT!', body: 'four', createdAt: day, updatedAt: day },
		{ id: 3, title: 'Budget', body: '', createdAt: day, updatedAt: day },
	]);
	try {
		const stats = await (await fetch(`${app.url}/api/stats`)).json();
		assert.equal(stats.count, 3);
		assert.equal(stats.words, 4);
		assert.equal(stats.duplicateTitles, 1);
		assert.deepEqual(stats.busiestDay, { day: '2026-03-10', count: 3 });
	} finally {
		await app.close();
	}
});
