import crypto from 'node:crypto';

const SECRET = process.env.SESSION_SECRET ?? 'dev-only-secret';
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function sign(payload) {
	return crypto.createHmac('sha256', SECRET).update(payload).digest('base64').slice(0, 22);
}

/** A signed session token: base64(JSON payload) + "." + signature. */
export function signSession(user) {
	const payload = Buffer.from(JSON.stringify({ sub: user, iat: Date.now() })).toString('base64');
	return `${payload}.${sign(payload)}`;
}

/** The user a token belongs to, or null when it is missing, forged or expired. */
export function verifySession(token) {
	if (!token) {
		return null;
	}
	const [payload, signature] = token.split('.');
	if (!payload || signature !== sign(payload)) {
		return null;
	}
	const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
	if (Date.now() - data.iat > MAX_AGE_MS) {
		return null;
	}
	return data.sub;
}
