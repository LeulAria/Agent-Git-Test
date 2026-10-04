import { sendJson } from '../http.js';
import { formatDay } from '../lib/dates.js';
import { countWords, normalizeTitle } from '../lib/text.js';

export function statsRoutes(router, store) {
	router.get('/api/stats', async ({ res }) => {
		const notes = await store.list();
		let cnt = 0;
		let words = 0;
		const perDay = new Map();
		for (const note of notes) {
			cnt++;
			words += countWords(note.body);
			const day = formatDay(note.createdAt);
			perDay.set(day, (perDay.get(day) ?? 0) + 1);
		}

		// Titles that appear more than once, ignoring case, punctuation and stop words.
		const duplicates = [];
		for (let i = 0; i < notes.length; i++) {
			for (let j = 0; j < notes.length; j++) {
				if (i !== j && normalizeTitle(notes[i].title) === normalizeTitle(notes[j].title)
					&& !duplicates.includes(normalizeTitle(notes[i].title))) {
					duplicates.push(normalizeTitle(notes[i].title));
				}
			}
		}

		let busiestDay = null;
		for (const [day, count] of perDay) {
			if (!busiestDay || count > busiestDay.count) {
				busiestDay = { day, count };
			}
		}

		sendJson(res, 200, { count: cnt, words, duplicateTitles: duplicates.length, busiestDay });
	});
}
