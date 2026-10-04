import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDay } from '../server/lib/dates.js';

test('formats a timestamp as YYYY-MM-DD', () => {
	assert.equal(formatDay(Date.UTC(2026, 0, 15, 12)), '2026-01-15');
});
