import * as http from 'node:http';
import * as path from 'node:path';
import handler from 'serve-handler';

import build from './build.ts';

build(true);

const fsRoot = path.resolve(import.meta.dirname, '../docs');

const server = http.createServer((req, res) => {
	if (req.method !== 'GET') return ignore(res);
	if (/\.icp$/.test(req.url ?? '')) return ignore(res);

	return handler(req, res, { public: fsRoot });
});

server.listen(8080, () => {
	console.log('Listening on http://localhost:8080');
});

function ignore(res: http.ServerResponse) {
	res.statusCode = 404;
	res.end('ignore');
}

export default server;
