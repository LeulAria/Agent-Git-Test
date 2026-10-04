/** A tiny method + path router. Patterns use `:name` for one path segment. */
export function createRouter() {
	const routes = [];
	const add = method => (pattern, handler) => {
		const keys = [];
		const source = pattern.replace(/:(\w+)/g, (_, key) => {
			keys.push(key);
			return '([^/]+)';
		});
		routes.push({ method, re: new RegExp(`^${source}$`), keys, handler });
	};
	return {
		get: add('GET'),
		post: add('POST'),
		patch: add('PATCH'),
		delete: add('DELETE'),
		/** Runs the first matching route. Returns false when nothing matched. */
		async handle(req, res) {
			const url = new URL(req.url, 'http://localhost');
			for (const route of routes) {
				if (route.method !== req.method) {
					continue;
				}
				const match = route.re.exec(url.pathname);
				if (!match) {
					continue;
				}
				const params = Object.fromEntries(route.keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]));
				await route.handler({ req, res, params, query: url.searchParams });
				return true;
			}
			return false;
		},
	};
}
