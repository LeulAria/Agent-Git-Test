import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isoDay } from '../server/lib/dates.js';

test('isoDay prints the UTC day', () => {
	assert.equal(isoDay(Date.UTC(2026, 9, 5, 23, 0)), '2026-10-05');
});
