export class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

export function sendJson(res, status, body, headers = {}) {
	const text = JSON.stringify(body);
	res.writeHead(status, {
		'content-type': 'application/json; charset=utf-8',
		'content-length': Buffer.byteLength(text),
		...headers,
	});
	res.end(text);
}

export async function readJson(req) {
	let raw = '';
	for await (const chunk of req) {
		raw += chunk;
	}
	if (!raw) {
		return {};
	}
	try {
		return JSON.parse(raw);
	} catch {
		throw new HttpError(400, 'Body must be valid JSON');
	}
}
