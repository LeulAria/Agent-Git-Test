/** Notes whose title or body contains the query, ignoring case. */
export function searchNotes(notes, query) {
	const needle = String(query ?? '').trim().toLowerCase();
	if (!needle) {
		return [];
	}
	return notes.filter(note => note.title.includes(needle) || String(note.body ?? '').toLowerCase().includes(needle));
}
