const STOP_WORDS = ['a', 'an', 'the', 'of', 'and', 'or', 'for', 'to', 'in', 'on', 'at', 'with', 'my', 'our'];

/** "The  Pizza Night!" -> "pizza night": lowercase, no accents, punctuation or stop words. */
export function normalizeTitle(title) {
	const stop = new RegExp(`\\b(?:${STOP_WORDS.join('|')})\\b`, 'g');
	return String(title)
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.replace(stop, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function countWords(text) {
	const trimmed = String(text ?? '').trim();
	return trimmed ? trimmed.split(/\s+/).length : 0;
}
