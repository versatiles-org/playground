import * as http from 'node:http';
import * as path from 'node:path';
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

const port = Number(process.env.PORT) || 8080;
export const url = `http://localhost:${port}`;

server.listen(port, () => {
	console.log(`Listening on ${url}`);
});

function ignore(res: http.ServerResponse) {
	res.statusCode = 404;
	res.end();
}

export default server;
