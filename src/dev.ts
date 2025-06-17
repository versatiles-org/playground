import { serveDir } from '@std/http/file-server';

import build from './build.ts';

build(true);

const fsRoot = (new URL('../docs', import.meta.url)).pathname;

const server = Deno.serve({ port: 8080 }, (req: Request) => {
	if (req.method !== 'GET') return ignore();
	if (/\.icp$/.test(req.url)) return ignore();

	return serveDir(req, { fsRoot, urlRoot: '', quiet: true });

	function ignore() {
		return new Response('ignore', { status: 404 });
	}
});

export default server;
