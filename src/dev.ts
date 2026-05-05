import * as http from 'node:http';
import * as path from 'node:path';
import handler from 'serve-handler';

import build from './build.ts';

await build();

const fsRoot = path.resolve(import.meta.dirname, '../docs');

const server = http.createServer((req, res) => {
	if (req.method !== 'GET') return ignore(res);
	if (/\.icp$/.test(req.url ?? '')) return ignore(res);

	// serve-handler with cleanUrls:false skips index.html resolution for directory
	// requests, so do it manually to match GitHub Pages behavior.
	const url = req.url ?? '/';
	if (url.endsWith('/')) req.url = url + 'index.html';

	return handler(req, res, { public: fsRoot, cleanUrls: false });
});

const url = 'http://localhost:8080';
server.listen(8080, () => {
	console.log(`Listening on ${url}`);
});

function ignore(res: http.ServerResponse) {
	res.statusCode = 404;
	res.end('ignore');
}

export default server;
