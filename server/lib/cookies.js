/** "a=1; b=2" -> URLSearchParams { a: "1", b: "2" } */
export function parseCookies(header = '') {
	return new URLSearchParams(String(header).split(/;\s*/).join('&'));
}

export function sessionCookie(token) {
	return `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800`;
}
