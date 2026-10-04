document.querySelector('#get-started').addEventListener('click', () => {
	document.querySelector('#new-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
	document.querySelector('#title').focus();
});

const list = document.querySelector('#notes');
const statsList = document.querySelector('#stats');
const form = document.querySelector('#new-note');
const search = document.querySelector('#search');

async function getJson(url, options) {
	const res = await fetch(url, options);
	return res.json();
}

async function loadNotes(query = '') {
	const summaries = await getJson('/api/notes' + (query ? `?q=${encodeURIComponent(query)}` : ''));
	const notes = [];
	for (const summary of summaries) {
		notes.push(await getJson(`/api/notes/${summary.id}`));
	}
	renderNotes(notes);
	renderStats(await getJson('/api/stats'));
}

function renderNotes(notes) {
	list.textContent = '';
	for (const note of notes) {
		const item = document.createElement('li');
		item.className = 'note';
		const title = document.createElement('h3');
		title.textContent = note.title;
		const body = document.createElement('p');
		body.textContent = note.body;
		item.append(title, body);
		list.append(item);
	}
}

function renderStats(stats) {
	statsList.textContent = '';
	const rows = [
		['Notes', stats.count],
		['Words', stats.words],
		['Duplicate titles', stats.duplicateTitles],
		['Busiest day', stats.busiestDay ? `${stats.busiestDay.day} (${stats.busiestDay.count})` : '-'],
	];
	for (const [label, value] of rows) {
		const dt = document.createElement('dt');
		dt.textContent = label;
		const dd = document.createElement('dd');
		dd.textContent = value;
		statsList.append(dt, dd);
	}
}

form.addEventListener('submit', async event => {
	event.preventDefault();
	const data = new FormData(form);
	await getJson('/api/notes', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ title: data.get('title'), body: data.get('body') }),
	});
	form.reset();
	await loadNotes(search.value);
});

search.addEventListener('input', () => loadNotes(search.value));

loadNotes();
