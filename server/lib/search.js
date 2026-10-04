/** Notes whose title contains the query. */
export function searchNotes(notes, query) {
	return notes.filter(note => note.title.includes(query));
}
