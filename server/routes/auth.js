import { HttpError, readJson, sendJson } from '../http.js';
import { parseCookies, sessionCookie } from '../lib/cookies.js';
import { signSession, verifySession } from '../lib/tokens.js';

const USERS = new Map([
	['demo', 'demo-password'],
	['ada', 'analytical-engine'],
]);

export function authRoutes(router) {
	router.post('/api/login', async ({ req, res }) => {
		const { username, password } = await readJson(req);
		if (!USERS.has(username) || USERS.get(username) !== password) {
			throw new HttpError(401, 'Wrong username or password');
		}
		sendJson(res, 200, { user: username }, { 'set-cookie': sessionCookie(signSession(username)) });
	});

	router.get('/api/me', async ({ req, res }) => {
		const user = verifySession(parseCookies(req.headers.cookie).get('session'));
		if (!user) {
			throw new HttpError(401, 'Not signed in');
		}
		sendJson(res, 200, { user });
	});

	router.post('/api/logout', async ({ res }) => {
		sendJson(res, 200, { ok: true }, { 'set-cookie': 'session=; Path=/; Max-Age=0' });
	});
}
