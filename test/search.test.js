import assert from 'node:assert/strict';
import { test } from 'node:test';
import { searchNotes } from '../server/lib/search.js';

const notes = [
	{ id: 1, title: 'Pizza night', body: 'dough at 5' },
	{ id: 2, title: 'Quarterly planning', body: 'review the budget' },
];

test('finds notes by title', () => {
	assert.deepEqual(searchNotes(notes, 'Pizza').map(n => n.id), [1]);
});

test('returns nothing when no title matches', () => {
	assert.deepEqual(searchNotes(notes, 'zebra'), []);
});
