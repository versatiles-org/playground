import * as http from 'node:http';
import * as path from 'node:path';
import type { AddressInfo } from 'node:net';
import handler from 'serve-handler';

import build from './build.ts';

await build();

const fsRoot = path.resolve(import.meta.dirname, '../docs');

const server = http.createServer((req, res) => {
	if (req.method !== 'GET') return ignore(res);

	// serve-handler with cleanUrls:false skips index.html resolution for directory
	// requests, so do it manually to match GitHub Pages behavior.
	const raw = req.url ?? '/';
	const queryIdx = raw.indexOf('?');
	const pathname = queryIdx === -1 ? raw : raw.slice(0, queryIdx);
	const query = queryIdx === -1 ? '' : raw.slice(queryIdx);
	if (pathname.endsWith('/')) req.url = pathname + 'index.html' + query;

	return handler(req, res, { public: fsRoot, cleanUrls: false });
});

const preferredPort = Number(process.env.PORT) || 8080;

/**
 * Falls back to a free port when the preferred one is taken, so the tests still
 * run while a `npm run dev` server is open — otherwise they die on EADDRINUSE
 * for a reason that has nothing to do with what they test.
 */
const port = await new Promise<number>((resolve, reject) => {
	let fallbackTried = false;

	server.once('listening', () => resolve((server.address() as AddressInfo).port));
	server.on('error', (err: NodeJS.ErrnoException) => {
		if (err.code !== 'EADDRINUSE' || fallbackTried) return reject(err);
		fallbackTried = true;
		server.listen(0);
	});

	server.listen(preferredPort);
});

export const url = `http://localhost:${port}`;
console.log(`Listening on ${url}`);

function ignore(res: http.ServerResponse) {
	res.statusCode = 404;
	res.end();
}

export default server;
