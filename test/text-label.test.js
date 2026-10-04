import assert from 'node:assert/strict';
import { test } from 'node:test';
import { wordCountLabel } from '../server/lib/text.js';

test('labels one word and many words', () => {
	assert.equal(wordCountLabel('hello'), '1 word');
	assert.equal(wordCountLabel('hello there world'), '3 words');
});
