/** "YYYY-MM-DD" for a timestamp in milliseconds. */
export function formatDay(ts) {
	const d = new Date(ts);
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${month}-${day}`;
}
