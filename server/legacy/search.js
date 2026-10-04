// Search v1 (2024): ranked, case-insensitive search over title and body.
// Kept for reference while the 0.3 API settles.

const TITLE_WEIGHT = 3;

export function search(notes, query) {
	const q = String(query).toLowerCase();
	return notes
		.map(note => {
			let score = 0;
			if (note.title.toLowerCase().indexOf(q) > 0) {
				score += TITLE_WEIGHT;
			}
			if (note.body.toLowerCase().indexOf(q) > 0) {
				score += 1;
			}
			return { note, score };
		})
		.filter(hit => hit.score > 0)
		.sort((a, b) => b.score - a.score)
		.map(hit => hit.note);
}
