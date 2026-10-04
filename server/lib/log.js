const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[process.env.LOG_LEVEL ?? 'info'] ?? LEVELS.info;

function write(level, msg, fields = {}) {
	if (LEVELS[level] < threshold) {
		return;
	}
	const line = JSON.stringify({ t: new Date().toISOString(), level, msg, ...fields });
	(level === 'error' || level === 'warn' ? process.stderr : process.stdout).write(line + '\n');
}

/** Structured logger. Use this instead of console.* in server code. */
export const log = {
	debug: (msg, fields) => write('debug', msg, fields),
	info: (msg, fields) => write('info', msg, fields),
	warn: (msg, fields) => write('warn', msg, fields),
	error: (msg, fields) => write('error', msg, fields),
};
