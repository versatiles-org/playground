import * as http from 'node:http';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';
import { spawn } from 'node:child_process';
import handler from 'serve-handler';

import build from './build.ts';

await build();

const fsRoot = path.resolve(import.meta.dirname, '../docs');

const server = http.createServer((req, res) => {
	if (req.method !== 'GET') return ignore(res);
	if (/\.icp$/.test(req.url ?? '')) return ignore(res);

	return handler(req, res, { public: fsRoot, cleanUrls: false });
});

const url = 'http://localhost:8080';
server.listen(8080, () => {
	console.log(`Listening on ${url}`);
	openOnce(url);
});

function ignore(res: http.ServerResponse) {
	res.statusCode = 404;
	res.end('ignore');
}

function openOnce(target: string) {
	// Marker stores tsx's PID; survives tsx-watch script restarts (SIGTERM to child),
	// is cleared on SIGINT, and is treated as stale if the PID is no longer alive.
	const marker = path.join(os.tmpdir(), 'versatiles-playground-dev.lock');
	if (fs.existsSync(marker)) {
		const oldPid = Number(fs.readFileSync(marker, 'utf-8')) || 0;
		try { process.kill(oldPid, 0); return; } catch { /* stale, fall through */ }
	}
	fs.writeFileSync(marker, String(process.ppid));

	const cmd = process.platform === 'darwin' ? 'open'
		: process.platform === 'win32' ? 'start'
		: 'xdg-open';
	spawn(cmd, [target], { stdio: 'ignore', detached: true }).unref();

	const cleanup = () => { try { fs.unlinkSync(marker); } catch { /* */ } };
	process.on('SIGINT', () => { cleanup(); process.exit(130); });
}

export default server;
