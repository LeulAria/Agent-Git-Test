import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countWords } from '../server/lib/text.js';

test('counts words separated by any whitespace', () => {
	assert.equal(countWords('one  two\tthree\nfour'), 4);
});
